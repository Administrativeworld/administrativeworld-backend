// mediasoupSetup.js
import mediasoup from "mediasoup";
import { Server } from "socket.io";
import Course from "../models/Course.js";

let worker;
export let routers = {};
let producerTransports = {};
let consumerTransports = {};
let producers = {};
let consumers = {};

export async function setupMediasoup(io) {
  worker = await mediasoup.createWorker();
  console.log("🚀 Mediasoup worker created!");

  io.on("connection", (socket) => {
    console.log("🔌 Client connected:", socket.id);

    socket.on("startLiveClass", async ({ courseId }, callback) => {
      console.log(`🔹 Received startLiveClass request for course: ${courseId}`);

      const course = await Course.findById(courseId);
      if (!course) {
        console.error(`🚨 Course not found: ${courseId}`);
        return callback({ error: "Course not found" });
      }

      if (!routers[courseId]) {
        console.log(`⚡ Creating Mediasoup router for course: ${courseId}`);
        routers[courseId] = await worker.createRouter({
          mediaCodecs: [
            { kind: "audio", mimeType: "audio/opus", clockRate: 48000, channels: 2 },
            { kind: "video", mimeType: "video/H264", clockRate: 90000, parameters: { "packetization-mode": 1 } },
          ],
        });
      } else {
        console.log(`✅ Mediasoup router already exists for course: ${courseId}`);
      }

      const rtpCapabilities = routers[courseId].rtpCapabilities;

      console.log(`🎥 Live class started for course: ${courseId}`);
      callback({ rtpCapabilities }); // ✅ RETURNING RTP CAPABILITIES
    });


    socket.on("endLiveClass", ({ courseId }) => {
      [producers, producerTransports].forEach(store => {
        if (store[courseId]) {
          store[courseId].close();
          delete store[courseId];
        }
      });
      console.log(`🔴 Live class ended for course ${courseId}`);
    });
    socket.on("resume", async ({ courseId, studentId, consumerId }, callback) => {
      try {
        const consumer = consumers?.[courseId]?.[studentId];
        if (!consumer) {
          return callback({ error: "❌ Consumer not found" });
        }

        // Resume the consumer
        await consumer.resume();
        console.log(`▶️ Consumer resumed: ${studentId} @ ${courseId}`);
        callback({ resumed: true });
      } catch (err) {
        console.error("❌ resume error:", err);
        callback({ error: "Failed to resume consumer" });
      }
    });
    socket.on("createProducerTransport", async ({ courseId }, callback) => {
      try {
        const router = routers[courseId];
        if (!router) return callback({ error: "❌ Course router not found" });

        const transport = await router.createWebRtcTransport({
          listenIps: [{ ip: "127.0.0.1", announcedIp: null }],
          enableUdp: true,
          enableTcp: true,
          preferUdp: true,
        });

        producerTransports[courseId] = transport;
        console.log(`🎥 Producer transport created for course ${courseId}`);

        callback({
          id: transport.id,
          iceParameters: transport.iceParameters,
          iceCandidates: transport.iceCandidates,
          dtlsParameters: transport.dtlsParameters,
        });
      } catch (err) {
        console.error("❌ createProducerTransport error:", err);
        callback({ error: "Failed to create producer transport" });
      }
    });

    socket.on("connectProducerTransport", async ({ courseId, dtlsParameters }, callback) => {
      try {
        const transport = producerTransports[courseId];
        if (!transport) return callback({ error: "❌ Producer transport not found" });

        await transport.connect({ dtlsParameters });
        console.log(`✅ Producer transport connected for course ${courseId}`);
        callback();
      } catch (err) {
        console.error("❌ connectProducerTransport error:", err);
        callback({ error: "Failed to connect producer transport" });
      }
    });

    socket.on("produce", async ({ courseId, kind, rtpParameters }, callback) => {
      try {
        const transport = producerTransports[courseId];
        if (!transport) return callback({ error: "❌ Producer transport not found" });

        const producer = await transport.produce({ kind, rtpParameters });
        producers[courseId] = producer;
        console.log(`🎬 Producer created for course ${courseId} (Kind: ${kind})`);

        callback({ id: producer.id });
      } catch (err) {
        console.error("❌ produce error:", err);
        callback({ error: "Failed to start producing stream" });
      }
    });

    socket.on("createConsumerTransport", async ({ courseId, studentId }, callback) => {
      try {
        const course = await Course.findById(courseId);
        if (!course || !course.studentsEnroled.includes(studentId)) {
          return callback({ error: "❌ Not enrolled in this course" });
        }

        const router = routers[courseId];
        if (!router) return callback({ error: "❌ Router not found" });

        const transport = await router.createWebRtcTransport({
          listenIps: [{ ip: "127.0.0.1", announcedIp: null }],
          enableUdp: true,
          enableTcp: true,
          preferUdp: true,
        });

        if (!consumerTransports[courseId]) consumerTransports[courseId] = {};
        consumerTransports[courseId][studentId] = transport;

        console.log(`🚛 Consumer transport created: ${studentId} @ ${courseId}`);

        callback({
          id: transport.id,
          iceParameters: transport.iceParameters,
          iceCandidates: transport.iceCandidates,
          dtlsParameters: transport.dtlsParameters,
        });
      } catch (err) {
        console.error("❌ createConsumerTransport error:", err);
        callback({ error: "Failed to create consumer transport" });
      }
    });

    socket.on("connectConsumerTransport", async ({ courseId, studentId, dtlsParameters }, callback) => {
      try {
        const transport = consumerTransports?.[courseId]?.[studentId];
        if (!transport) return callback({ error: "❌ Consumer transport not found" });

        await transport.connect({ dtlsParameters });
        console.log(`🔗 Consumer transport connected: ${studentId} @ ${courseId}`);
        callback();
      } catch (err) {
        console.error("❌ connectConsumerTransport error:", err);
        callback({ error: "Failed to connect consumer transport" });
      }
    });

    socket.on("consume", async ({ courseId, studentId, rtpCapabilities }, callback) => {
      try {
        const course = await Course.findById(courseId);
        if (!course || !course.studentsEnroled.includes(studentId)) {
          return callback({ error: "❌ Not enrolled in this course" });
        }

        const router = routers[courseId];
        const producer = producers[courseId];
        const transport = consumerTransports?.[courseId]?.[studentId];

        if (!router || !producer || !transport) {
          return callback({ error: "❌ Missing components for consumption" });
        }

        if (!router.canConsume({ producerId: producer.id, rtpCapabilities })) {
          return callback({ error: "❌ Cannot consume this stream" });
        }

        const consumer = await transport.consume({
          producerId: producer.id,
          rtpCapabilities,
          paused: true,
        });

        if (!consumers[courseId]) consumers[courseId] = {};
        consumers[courseId][studentId] = consumer;

        console.log(`📥 Consuming media: ${studentId} @ ${courseId}`);

        callback({
          id: consumer.id,
          producerId: producer.id,
          kind: consumer.kind,
          rtpParameters: consumer.rtpParameters,
        });
      } catch (err) {
        console.error("❌ consume error:", err);
        callback({ error: "Failed to consume stream" });
      }
    });

    socket.on("disconnect", () => {
      console.log(`🔌 Disconnected socket: ${socket.id}`);
    });
  });
}
