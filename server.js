const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
    // クライアントが接続したときのログ
    socket.on('user connected', (clientId) => {
        socket.clientId = clientId;
        console.log(clientId + ' connected');
    });

    // クライアントが「game」ルームに入ったとき
    socket.on('join', (room) => {
        socket.join(room);
        console.log(`Client joined room: ${room}`);
    });
    
    // スマホからセンサーデータを受信し、全ゲームクライアントにリレー
    socket.on('sensor', (data) => {
        // raw data { id, a, b, g, z } をそのまま 'sensor' イベントとしてブロードキャスト
        io.to('game').emit('sensor', data); 
    });

    socket.on('disconnect', () => {
        if (socket.clientId) {
            console.log(socket.clientId + ' disconnected');
        } else {
            console.log('Client disconnected');
        }
    });
});

// ★修正点：ポートを環境変数から取得し、なければ8080を使用する★
const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});