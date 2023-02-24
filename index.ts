import express, { Request, Response} from "express";
import socketio from "socket.io";
import path from "path";
import cors from 'cors';
import { User } from './index.interface'
import mysql2 from 'mysql2';
import { checkAuthentication } from "./utils/dbTools";
import session, { Session, SessionData } from 'express-session';
import bodyParser from 'body-parser';

interface UserSession extends Session {
  user?: { id: number, name: string };
}

declare module "express-session" {
  interface SessionData {
    user: User;
  }
}


var connection = mysql2.createConnection({
  host: '100.103.227.61',
  user: 'diplom',
  password: 'password',
  database: 'test'
})

connection.connect()

connection.query('SELECT 1 + 1 AS solution', function (err, rows, fields) {
  if (err) throw err
  console.log('The solution is: ', rows[0].solution)
})

// create tables with foreign keys
connection.execute('CREATE TABLE IF NOT EXISTS users ( id INTEGER PRIMARY KEY NOT NULL AUTO_INCREMENT, username VARCHAR(256), password VARCHAR(32) NOT NULL,email VARCHAR(320),is_admin INTEGER DEFAULT 0 NOT NULL, created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP);');

connection.execute('CREATE TABLE IF NOT EXISTS chats (id INTEGER PRIMARY KEY NOT NULL AUTO_INCREMENT,name VARCHAR(256),created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP);');

connection.execute('CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY NOT NULL AUTO_INCREMENT,user_id INTEGER NOT NULL,chat_id INTEGER NOT NULL,msg_type INTEGER,msg VARCHAR(4096),CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id),CONSTRAINT fk_chat_id FOREIGN KEY (chat_id) REFERENCES chats(id));');


connection.execute('CREATE TABLE IF NOT EXISTS chat_users (id INTEGER PRIMARY KEY NOT NULL AUTO_INCREMENT,user_id INTEGER NOT NULL,chat_id INTEGER NOT NULL,CONSTRAINT fk_cu_user_id FOREIGN KEY (user_id) REFERENCES users(id),CONSTRAINT fk_cu_chat_id FOREIGN KEY (chat_id) REFERENCES chats(id));');

connection.query('SELECT * from users',[], (err, results) => {
    console.log(results);
  }
);



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
// app.use(cors())
const allowedDomains = ['http://localhost:3000','http://100.103.227.61:3000', 'http://0.0.0.0:3000']
app.use(cors({
  origin: allowedDomains,
  credentials: true
}));
app.use(session({
  secret: 'your_secret_key_here', // this should be a random string
  resave: false,
  saveUninitialized: false,
  cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: false
    },
}));
app.use(bodyParser.json())

let http = require("http").Server(app);
// set up socket.io and bind it to our
// http server.
let io = require("socket.io")(http);

app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.resolve("./client/index.html"));
});
app.get("/getMessages", (req: Request, res: Response)=>{
  res.send({items: messages});
})


app.post('/login', (req, res) => {
  const { id, username, password, email } = req.body;

  // Check authentication
  if (checkAuthentication()) {
    // Set user data in the session
    const user = { id, username, password, email };
    req.session.user = user;
    res.json({ message: 'Logged in successfully!', user });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});


app.post('/getSession', (req, res) => {
  const user = req.session.user;
  if (user) {
    res.json({ message: 'Logged in!', user });
  } else {
    res.status(401).json({ message: 'Not logged In' });
  }  
});

app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Error destroying session' });
    } else {
      res.clearCookie('session'); // clear the cookie from the client
      res.status(200).json({ message: 'Session destroyed' });
    }
  });
});





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

