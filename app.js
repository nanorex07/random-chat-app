const express = require("express");
const socket = require("socket.io");
const http = require("http");
const path = require("path");
const e = require("express");
const app = express();
const PORT = 3000 || process.env.PORT;
const server = http.createServer(app);

const io = socket(server);

app.use(express.static('./public'));

let freeSocket = null;


const handle_connection = (socket)=>{
  if(freeSocket != null){
    socket.connected_to = freeSocket;
    freeSocket.connected_to = socket;
    socket.emit('toggle-connection');
    freeSocket.emit('toggle-connection');
    socket.emit("info", `Connected to ${freeSocket.username}`);
    freeSocket.emit("info", `Connected to ${socket.username}`); 
    freeSocket = null;
  }
  else{
    freeSocket = socket;
    socket.emit("info", `waiting for a user to connect...`);
  }
}

io.on('connection', (socket) => {

    socket.on("client_info", (auth)=>{
      socket.username = auth.username;
      socket.color = auth.color;
      socket.connected_to = null;
      handle_connection(socket);
      io.emit('increment-users', Object.keys(io.sockets.connected).length);
    })

    socket.on('disconnect', () => {
      if(socket.connected_to) {
        socket.connected_to.emit('info',`${socket.username} has disconnected.`);
        socket.connected_to.emit(`toggle-connection`);
        socket.connected_to.connected_to = null;
        handle_connection(socket.connected_to);
      }
      else{
        freeSocket = null;
      }
      io.emit('increment-users', Object.keys(io.sockets.connected).length);
    });

    socket.on('chat-message', (message)=>{
      if(socket.connected_to){
        socket.connected_to.emit("new-msg", {name: socket.username, color:socket.color,  message: message, })
      }
    })
  });

server.listen(PORT, ()=>{
    console.log(`[+] serving on ${PORT}`);
})