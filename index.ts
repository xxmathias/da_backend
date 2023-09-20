import express, { Request, Response} from "express";
import socketio from "socket.io";
import cors from 'cors';
import session from 'express-session';
import { connection, createUser, validateCredentials, getUserById, getUserByMail, getMessagesByChatId, getChatsByUserId, sendMessage, createChat, addUserToChat, removeUserFromChat, deleteChat, getMatchingUser, createChatUser, validatePassword, getUsersByChatId, comparePasswords, getHashedPassword, changeProfilePicture, changeChatPicture, getProfilePicture } from './utils/database/dbTools'
import { Chat, ChatUser, Message, User } from './index.interface'
import bodyParser from 'body-parser';
import fs from "fs";
import path from "path";
require('dotenv').config();

declare module "express-session" {
  interface SessionData {
    user: User;
  }
}

const defaultProfilePicture = 'data:image/png;base64,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'

async function createTables() {
  // creates tables if they exist and afterwards calls insertUsers() to fill the users table with example data
  try {
    console.log("Attempting to create necessary tables...");
      await connection.execute(`
          CREATE TABLE IF NOT EXISTS users (
              id INTEGER AUTO_INCREMENT PRIMARY KEY,
              username VARCHAR(256),
              password VARCHAR(255) NOT NULL,
              email VARCHAR(320),
              is_admin INTEGER DEFAULT 0 NOT NULL,
              created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              profile_picture MEDIUMTEXT
          );
      `);

      await connection.execute(`
          CREATE TABLE IF NOT EXISTS chats (
              id INT AUTO_INCREMENT PRIMARY KEY,
              name VARCHAR(256),
              last_message MEDIUMTEXT,
              created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              last_message_sent TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              chat_admin_id INT,
              isRoom BOOLEAN,
              chat_picture MEDIUMTEXT,
              CONSTRAINT fk_chat_admin_id FOREIGN KEY (chat_admin_id) REFERENCES users(id)
          );
      `);

      await connection.execute(`
          CREATE TABLE IF NOT EXISTS messages (
              id INTEGER AUTO_INCREMENT PRIMARY KEY,
              user_id INTEGER NOT NULL,
              chat_id INTEGER NOT NULL,
              msg_type INTEGER,
              msg MEDIUMTEXT,
              created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id),
              CONSTRAINT fk_chat_id FOREIGN KEY (chat_id) REFERENCES chats(id)
          );
      `);

      await connection.execute(`
          CREATE TABLE IF NOT EXISTS chat_users (
              id INTEGER AUTO_INCREMENT PRIMARY KEY,
              user_id INTEGER NOT NULL,
              chat_id INTEGER NOT NULL,
              CONSTRAINT fk_cu_user_id FOREIGN KEY (user_id) REFERENCES users(id),
              CONSTRAINT fk_cu_chat_id FOREIGN KEY (chat_id) REFERENCES chats(id)
          );
      `);

      await insertUsers();

  } catch (error) {
      console.error("Error creating tables:", error);
  }
}

async function insertUsers() {
  try {
    console.log("Checking for existing users...");
    const [rows] = await connection.query("SELECT COUNT(*) AS count FROM users");

    if (rows[0].count > 0) {
      console.log("Users already exist\nBackend is ready ✅");
      return;
    }

    const filePath = path.join(__dirname, 'users.json');
    const fileData = fs.readFileSync(filePath, 'utf8');
    const users = JSON.parse(fileData);

    let user1Id = null;
    const chatIds = {};

    // Insert users and get user1Id
    for (let user of users) {
      console.log(`Inserting user: ${user.username} ...`);
      const hashedPassword = getHashedPassword(user.password);
      const [result] = await connection.execute(
        'INSERT INTO users (username, password, email, is_admin) VALUES (?, ?, ?, ?)',
        [user.username, hashedPassword, user.email, user.is_admin]
      );

      const userId = result.insertId;

      if (user.username === 'user1') {
        user1Id = userId;
      }

      // Insert chats and map chat names to chat IDs
      if (user.chats) {
        for (const chat of user.chats) {
          if (!chatIds[chat.name]) {
            console.log(`Inserting chat: ${chat.name} ...`);
            const [chatResult] = await connection.execute(
              'INSERT INTO chats (name, chat_admin_id, isRoom) VALUES (?, ?, 1)',
              [chat.name, user1Id]
            );

            chatIds[chat.name] = chatResult.insertId;

            // Insert user1 into chat_users for each chat
            await connection.execute(
              'INSERT INTO chat_users (user_id, chat_id) VALUES (?, ?)',
              [user1Id, chatIds[chat.name]]
            );
          }

          // Insert other users into chat_users if they are not user1
          if (userId !== user1Id) {
            await connection.execute(
              'INSERT INTO chat_users (user_id, chat_id) VALUES (?, ?)',
              [userId, chatIds[chat.name]]
            );
          }
        }
      }
    }

    console.log("Users and chats inserted successfully\n Backend setup finished & ready to go ✅");
  } catch (error) {
    console.error("Error inserting users and chats:", error);
  }
}








(async () => {
  await createTables();
})();

const app = express();
app.set("port", process.env.PORT || 8080);
app.use(cors({ origin: true, credentials: true }));
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
let io = require("socket.io")(http); // set up socket.io and bind it to our http server.

app.get("/", async (req: Request, res: Response) => {
  res.send("hi")
});

app.get("/getUserById/:userId", (req: Request, res: Response) => {
  const { userId } = req.params;
  const promGetUserById = new Promise((resolve, reject) => {
    resolve(getUserById(parseInt(userId)));
  });
  promGetUserById.then((result: User) => {
    res.send({result});
  })  
})

app.get("/getMessagesByChatId/:chatId", (req: Request, res: Response) => {
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
  const promCreateChat = new Promise((resolve, reject) => {
    resolve(createChat(req.body.chatName, req.body.creatorId, req.body.selectedUser.length > 1));
    resolve(console.log("createChat body", req.body.selectedUser))
  });
  promCreateChat.then((res) => {
      //@ts-ignore
    createChatUser({user: {id: req.body.creatorId}, chat_id: res.insertId as number} )
    console.log("createChat: ",res);
    req.body.selectedUser.forEach((user: User)=>{
      //@ts-ignore
      createChatUser({user: user, chat_id: res.insertId as number} )
    })
  })
})

app.post("/getUserByChatId", (req, res) => {
  const getUserPromise = new Promise((resolve, reject) => {
    resolve(getUsersByChatId(req.body.chat_id, req.body.currentUserId));
  });

  getUserPromise
    .then((users) => {
      res.json(users); // Sending the response back to the frontend as JSON
    })
    .catch((error) => {
      // Handle any error that occurred during the getUserByChatId function
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    });
});

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

app.post('/login', async (req: Request, res: Response) => {
  const { password, email } = req.body;
  try {
    const user: User = await getUserByMail(email);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const isMatch = comparePasswords(password, user.password); // compare the password with the hashed password stored in DB

    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    req.session.user = user; 
    res.json({ message: 'Logged in successfully!', user }); // valid credentials, set user in the session

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.post('/changePassword', async (req, res) => {
  // user can change their password on the profile page, password must meet specific requirements. password is hashed and stored in db.
  const { oldPassword, newPassword, email } = req.body;
  try {
    const user: User = await getUserByMail(email);

    if (!user) { res.status(404).send('User not found'); return; }

    const isOldPasswordValid = comparePasswords(oldPassword, user.password);
    if (!isOldPasswordValid) { res.status(401).send('Invalid old password'); return; }

    const hashedNewPassword = getHashedPassword(newPassword);
    await connection.execute('UPDATE users SET password = ? WHERE id = ?', [hashedNewPassword, user.id]);

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

app.post('/getSession', (req: Request, res: Response) => {
  const user = req.session.user;
  if (user) {
    res.json({ message: 'Logged in!', user });
  } else {
    res.status(401).json({ message: 'Not logged In' });
  }  
});

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
    const messages: Message[] = req.body;
    const results = await Promise.all(messages.map(message => sendMessage(message)));
    console.log("results:", results);
    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error sending messages");
  }
});

app.post("/changeProfilePicture", async (req: Request, res: Response) => {
  try {
    const { userId, newPicture } = req.body;
    
    // Check if userId and newPicture are not undefined
    if (userId === undefined && newPicture === undefined) {
      return res.status(400).json({ error: 'Bad Request' });
    }

    if (newPicture === null) {
      const result = await changeProfilePicture(defaultProfilePicture, userId);
      return res.status(200).json({ message: 'Profile picture deleted' });
    }
    
    // Execute query
    const result = await changeProfilePicture(newPicture, userId);
    res.status(200).json({ message: 'Profile picture updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




app.post("/changeChatPicture", async (req: Request, res: Response) => {
  try {
    const { userId, newPicture } = req.body;
    // Check if userId and newPicture are not undefined
    if (userId === undefined || newPicture === undefined) {
      return res.status(400).json({ error: 'Bad Request' });
    }
    // Execute query
    const result = await changeChatPicture(newPicture,userId)
    res.status(200).json({ message: 'Profile picture updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/getProfilePicture', async (req: Request, res: Response) => {
  const userId = req.query.userId;
  if (userId === undefined) {
    return res.status(400).json({ error: 'Bad Request' });
  }
  const profilePicture = await getProfilePicture(userId);

  if (profilePicture[0].profile_picture == null) {
    const result = await changeProfilePicture(defaultProfilePicture, userId);
    return res.status(201).send('Cannot get profile_picture, profilepicture set to default');
  }

  if (profilePicture) {
    return res.status(200).send({ image: profilePicture });
  } else {
    return res.status(404).send('Cannot get profile_picture');
  }
});





app.get("/getMatchingUser/:inputString", (req: Request, res: Response) => {
  // will have to send chatId in request
  const {inputString} = req.params;
  // if(!inputString) return null
  const promGetMessagesByChatId = new Promise((resolve, reject) => {
    resolve(getMatchingUser(inputString));
  });
  promGetMessagesByChatId.then((result: any[]) => {
    res.send({result});
  })  
})

io.on("connection", function(socket) {
  // join a chat room when the client sends a 'join_room' event
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
  });

  socket.on("send_message", async (arg) => {
    try {
      const newMessage = await sendMessage(arg);
      // emit the new message to all sockets in the room
      io.to(arg.chat_id).emit("new_message", newMessage);
    } catch (error) {
      console.error(error);
    }
  });
});

io.on("User", (socket: socketio.Socket) =>{
  console.log("User Online");
})

const server = http.listen(8080, function() {
  console.log("listening on *:8080");
});

  // TO HASH ALL PASSWORDS IN DB
/*   const hashAllPasswords = async () => {
    try {
      // Get all users
      const [users] = await connection.execute('SELECT * FROM users');
    
      for (let user of users) {
        // Ignore users without a password
        if (!user.password) {
          console.warn(`User with id ${user.id} does not have a password set.`);
          continue;
        }
        
        // Hash each user's password
        const hashedPassword = getHashedPassword(user.password);
        
        // Update the user's password in the database
        await connection.execute('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, user.id]);
      }
  
      console.log('Passwords updated successfully');
    } catch (error) {
      console.error('Failed to hash passwords', error);
    }
  };
  hashAllPasswords(); */