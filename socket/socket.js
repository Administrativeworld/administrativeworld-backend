export default function socketIoServer(io) {
  
  const connectedUsers = new Map();
  io.on("connection", (socket) => {
 

    socket.on("disconnect", () => {
      // console.log(`❌ User Disconnected: ${socket.id}`);
    });
  });
}
