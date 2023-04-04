import express, { Request, Response} from "express";
import socketio from "socket.io";
import path from "path";
import cors from 'cors';
import session, { Session, SessionData } from 'express-session';
import { connection, createUser, validateCredentials, getUserById, getUsers, getUserByMail, getMessagesByChatId, getChatsByUserId, sendMessage, createChat, addUserToChat, removeUserFromChat, deleteChat } from './utils/database/dbTools'
import { Chat, Message, User } from './index.interface'
import bodyParser from 'body-parser';

interface UserSession extends Session {
  user?: { id: number, name: string };
}

declare module "express-session" {
  interface SessionData {
    user: User;
  }
}

// create tables with foreign keys
connection.execute('CREATE TABLE IF NOT EXISTS users ( id INTEGER PRIMARY KEY NOT NULL AUTO_INCREMENT, username VARCHAR(256), password VARCHAR(32) NOT NULL,email VARCHAR(320),is_admin INTEGER DEFAULT 0 NOT NULL, created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP);');
connection.execute('CREATE TABLE IF NOT EXISTS chats (id INTEGER PRIMARY KEY NOT NULL AUTO_INCREMENT,name VARCHAR(256),created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP);');
connection.execute('CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY NOT NULL AUTO_INCREMENT,user_id INTEGER NOT NULL,chat_id INTEGER NOT NULL,msg_type INTEGER,msg VARCHAR(4096),CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id),CONSTRAINT fk_chat_id FOREIGN KEY (chat_id) REFERENCES chats(id));');
connection.execute('CREATE TABLE IF NOT EXISTS chat_users (id INTEGER PRIMARY KEY NOT NULL AUTO_INCREMENT,user_id INTEGER NOT NULL,chat_id INTEGER NOT NULL,CONSTRAINT fk_cu_user_id FOREIGN KEY (user_id) REFERENCES users(id),CONSTRAINT fk_cu_chat_id FOREIGN KEY (chat_id) REFERENCES chats(id));');

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
  origin: true,
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

app.get("/", async (req: Request, res: Response) => {
  const user: User = { username: 'timy', email: 'timothy.djon@gmail.com', password: 'password', is_admin: 1};
  const user2: User = { username: 'timy2', email: 'timothy.djoon@gmail.com', password: 'password', is_admin: 1};

  const promGetUsers = new Promise((resolve, reject) => {
    resolve(getUsers());
  });
  promGetUsers.then((result: User[]) => {
    let i: any;
    for(i in result) {
      //console.log(`${result[i].username}`);
    }
  })
/* 
  const promGetUserById = new Promise((resolve, reject) => {
    resolve(getUserById(1));
  });
  promGetUserById.then((result: User) => {
    const user: User = result;
    console.log(user)
  }) */

  res.send("hi")
});

app.get("/getUserById/:userId", (req: Request, res: Response) => {
  // will have to send chatId in request
  const { userId } = req.params;
  const promGetUserById = new Promise((resolve, reject) => {
    resolve(getUserById(parseInt(userId)));
  });
  promGetUserById.then((result: Message[]) => {
    res.send({result});
  })  
})


app.get("/getMessagesByChatId/:chatId", (req: Request, res: Response) => {
  // will have to send chatId in request
  const { chatId } = req.params;
  const promGetMessagesByChatId = new Promise((resolve, reject) => {
    resolve(getMessagesByChatId(parseInt(chatId)));
  });
  promGetMessagesByChatId.then((result: Message[]) => {
    res.send({result});
  })  
})

app.get("/getChatsByUserId/:userId", (req: Request, res: Response) => {
  const { userId } = req.params;
  const promGetChatsByUserId = new Promise((resolve, reject) => {
    resolve(getChatsByUserId(parseInt(userId)));
    });
    promGetChatsByUserId.then((result: Chat[]) => {
      res.send({result});
    })  
})


app.post("/createChat", (req: Request, res: Response) => {
  // NEEDS TEST
  const promCreateChat = new Promise((resolve, reject) => {
    resolve(createChat(req.body.chatName));
  });
  promCreateChat.then((res) => {
    console.log("createChat: ",res);
  })
})

app.post("/deleteChat", (req: Request, res: Response) => {
  // NEEDS TEST
  const promCreateChat = new Promise((resolve, reject) => {
    resolve(deleteChat(req.body.chatId));
  });
  promCreateChat.then((res) => {
    console.log("deleteChat: ",res);
  })
})

app.post("/addUserToChat", (req: Request, res: Response) => {
  // NEEDS TEST
  const promAddUserToChat = new Promise((resolve, reject) => {
    resolve(addUserToChat(req.body.userId, req.body.chatId));
  })
  promAddUserToChat.then((res) => {
    console.log("addUserToChat: ", res)
  })
})

app.post("/removeUserFromChat", (req: Request, res: Response) => {
  // NEEDS TEST
  const promAddUserToChat = new Promise((resolve, reject) => {
    resolve(removeUserFromChat(req.body.userId, req.body.chatId));
  })
  promAddUserToChat.then((res) => {
    console.log("removeUserFromChat: ", res)
  })
})

app.post('/login', (req: Request, res: Response) => {
  const { password, email } = req.body;
  let user = { password, email };

  const promiseValidation = new Promise((resolve, reject) => {
    resolve(validateCredentials(user));
  });

  promiseValidation.then((result) => {
    if(!result) {
      res.status(401).send('Invalid credentials');
      console.log("Failed")
  } else {
    // set user data in the session
    const promGetUserByMail = new Promise((resolve, reject) => {
      resolve(getUserByMail(user.email));
    });
    promGetUserByMail.then((result: User) => {
      const user: User = result;
      req.session.user = user;
      res.json({ message: 'Logged in successfully!', user }); 
    })
  }
  });
});


app.post('/getSession', (req: Request, res: Response) => {
  const user = req.session.user;
  if (user) {
    res.json({ message: 'Logged in!', user });
  } else {
    res.status(401).json({ message: 'Not logged In' });
  }  
});

// app.post('/logout', (req: Request, res: Response) => {
//   req.session.destroy((err) => {
//     if (err) {
//       console.error(err);
//       res.status(500).json({ message: 'Error destroying session' });
//     } else {
//       req.session.user = null;
//       res.clearCookie('session'); // clear the cookie from the client
//       req.session.user = null;
//       console.log("logout: ", req.session)
//       res.status(200).json({ message: 'Session destroyed' });
//     }
//   });
// });
app.post('/logout', (req: Request, res: Response) => {
  req.session.user = null; // set the user property to null
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Error destroying session' });
    } else {
      res.clearCookie('session'); // clear the cookie from the client
      res.status(200).json({ message: 'Session destroyed', user: null });
    }
  });
});

app.post("/sendMessage", async (req: Request, res: Response) => {
  try {
    const { user_id, chat_id, msg_type, msg }: Message = req.body;
    const newMessage: Message = { user_id, chat_id, msg_type, msg };
    const result = await sendMessage(newMessage);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error sending message");
  }
});


// whenever a user connects on port 3000 via
// a websocket, log that a user has connected
io.on("connection", function(socket: any) {
  socket.on("test", (arg: Message) => {
    sendMessage(arg);
    socket.broadcast.emit("reload","reloadAll");
    socket.emit("reload","reloadAll");
  })
// to create default user if we dropped the tables again
/*     const user1: User = {email: "test@gmail.com", password: "password"}
    createUser(user1) */
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

