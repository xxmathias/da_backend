import express from "express";
import socketio from "socket.io";
import path from "path";
import cors from 'cors'


interface Imessage{
  sender: string;
  content: string;
}

let messages :Imessage[] = [
  {sender: "timy", content: "hello world"},
  {sender: "mathias", content: "hello world2"},
  {sender: "mathias", content: "hello world3"},
];

const app = express();
app.set("port", process.env.PORT || 8080);
app.use(cors())


let http = require("http").Server(app);
// set up socket.io and bind it to our
// http server.
let io = require("socket.io")(http);

app.get("/", (req: any, res: any) => {
  res.sendFile(path.resolve("./client/index.html"));
});
app.get("/getMessages", (req:any, res: any)=>{
  res.send({items: messages});
})

// whenever a user connects on port 3000 via
// a websocket, log that a user has connected
io.on("connection", function(socket: any) {
  console.log("a user connected");
  socket.on("test", (arg: Imessage)=>{
    console.log("succesful", arg)
    messages.push(arg)
    socket.broadcast.emit("reload","reloadAll");
    socket.emit("reload","reloadAll");
  })

});

io.on("User", (socket: socketio.Socket) =>{
  console.log("User Online");
})


const server = http.listen(8080, function() {
  console.log("listening on *:8080");
});







// import express, { Express, Request, Response } from 'express';
// import * as http from 'http';
// import cors from 'cors'

// // import next, { NextApiHandler } from 'next';
// import * as socketio from 'socket.io';
// const app = express()
// const port = 8080
// const server: http.Server = http.createServer(app);
// app.use(cors())

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })



// const io: socketio.Server = new socketio.Server(server ,{
//   cors: {
//     "origin": "*",
//     "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
//     "preflightContinue": false,
//     "optionsSuccessStatus": 204
//   }    
// });    

// io.on("connect_error", (err) => {
//   console.log(`connect_error due to ${err.message}`);
// });  

// io.on('connection', (socket) => {
//   console.log('a user connected');
// });  



// io.on('connection', (socket: socketio.Socket) => {
//   console.log('connection');
//   socket.emit('status', 'Hello from Socket.io');
//   socket.on('disconnect', () => {
//     console.log('client disconnected');
//   })  
// });  
// io.on("User", (socket: socketio.Socket) =>{
//   console.log("User Online");
// })  



// app.get('/', (req:Request, res:Response) => {
//   res.send('Hello World!')
// })  

// io.attach(server);

