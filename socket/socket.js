export default function socketIoServer(io) {
  io.on("connection", (socket) => {
 

    socket.on("disconnect", () => {
      // console.log(`❌ User Disconnected: ${socket.id}`);
    });
  });
}
