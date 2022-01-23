const express = require("express");
const socket = require("socket.io");
const http = require("http");
const path = require("path");
const app = express();
const PORT = 3000 || process.env.PORT;
const server = http.createServer(app);

const io = socket(server);

app.use(express.static('./public'));

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    socket.on('send-name', (client)=>{
      socket.username = client.name;
      socket.color = client.color;
      socket.broadcast.emit('joined-chat', client.name);
    })

    socket.on('chat-message', (message)=>{
      socket.broadcast.emit("new-msg", {name: socket.username, color:socket.color,  message: message, })
    })
  });

server.listen(PORT, ()=>{
    console.log(`[+] serving on ${PORT}`);
})