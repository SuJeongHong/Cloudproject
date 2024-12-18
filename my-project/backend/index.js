const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { 
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

// Socket.io 이벤트 핸들러
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// 미들웨어
app.use(cors());
app.use(express.json());



// 라우터 설정 (Socket.io 인스턴스 전달)
const setupRoutes = (io) => {
    const roomRoutes = require('./routes/rooms')(io);
    const gameRoutes = require('./routes/games')(io);
    const monitoringRoutes = require('./routes/monitoring');

    app.use('/api', roomRoutes);
    app.use('/api', gameRoutes);
    app.use('/api', monitoringRoutes);
};

setupRoutes(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = { io };
