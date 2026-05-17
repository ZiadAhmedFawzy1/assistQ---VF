// socket.js
const { Server } = require("socket.io");

let io; 

function initSocket(server) {
    io = new Server(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    io.on("connection", (socket) => {
        // console.log("New socket connection:", socket.id);

        socket.on("disconnect", () => {
            // console.log("Socket disconnected:", socket.id);
        });

        // مثال لاستقبال حدث معين
        socket.on("client-message", (data) => {
            // console.log("Message from client:", data);
        });
    });

    return io;
}

function getIO() {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
}

module.exports = {
    initSocket,
    getIO
};
