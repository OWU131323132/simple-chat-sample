const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
	socket.on('user connected', (clientId) => {
		socket.clientId = clientId;
		console.log(clientId + ' connected');
	});

	socket.on('join', (room) => {
		socket.join(room);
		console.log(`Client joined room: ${room}`);
	});
	
	socket.on('sensor', (data) => {
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

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
	console.log(`listening on *:${PORT}`);
});