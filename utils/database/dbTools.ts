import { User, Chat, Message, ChatUser } from "../../index.interface";
import mysql from "mysql2";

export const connection = mysql.createPool({
    host: "100.103.227.61",
    user: "diplom",
    password: "password",
    database: "test",
  }).promise();

  export const con = mysql.createConnection({
    host: "100.103.227.61",
    user: "diplom",
    password: "password",
    database: "test",
  })

export const validateCredentials = async (user: User): Promise<boolean> => {
  const [result] = await connection.query(
    "SELECT password from users WHERE email = ? AND password = ?",
    [user.email, user.password]
  );
  return result[0] ? true : false;
};

// USER OPERATIONS
export async function createUserHelper(email: string) {
  // checks if provided email already exists
  const [rows] = await connection.query(
    `
  SELECT email
  FROM users
  WHERE email = ?
  `,
    [email]
  );
  return rows[0];
}

export async function createUser(newUser: User): Promise<void> {
  // checks if provided email already exists, if not -> new user gets created
  const promGetEmail = new Promise((resolve, reject) => {
    resolve(createUserHelper(newUser.email));
  });
  promGetEmail.then((result: any) => {
    if (result) {
      console.log("email already in db");
    } else {
      const [result] = connection.query(
        "INSERT INTO users (username, email, password, is_admin) VALUES (?, ?, ?, ?)",
        [newUser.username, newUser.email, newUser.password, newUser.is_admin]
      );
      console.log("successfully added new user!");
    }
  });
}

export async function getUsers(): Promise<User[]> {
  // returns all users
  const [rows] = await connection.execute("SELECT * FROM users");
  return rows as User[];
}

export async function getUserById(id: number): Promise<User | null> {
  const [rows] = await connection.execute("SELECT * FROM users WHERE id = ?", [
    id,
  ]);
  if (!rows) {
    return null;
  }
  return rows[0] as User;
}

export async function getUserByMail(email: string): Promise<User | null> {
  const [rows] = await connection.execute("SELECT username, email, is_admin, created_on FROM users WHERE email = ?", [
    email,
  ]);
  if (!rows) {
    return null;
  }
  return rows[0] as User;
}


export async function sendMessage(newMessage: Message) {
  // sends Message and sets has_read for each user in the chat
  let insertedMsgId: number;
  let [res] = await connection.execute(
    `INSERT INTO messages (user_id, chat_id, msg_type, msg) VALUES (?, ?, ?, ?)`,
    [newMessage.user_id, newMessage.chat_id, newMessage.msg_type, newMessage.msg]
  );
  insertedMsgId = res.insertId;
  (async () => {
    const chatUser = await connection.execute(
      'SELECT cu.user_id FROM chat_users cu WHERE cu.user_id != ? AND cu.chat_id = ?',
      [newMessage.user_id, newMessage.chat_id]
    );

    chatUser[0].forEach(chatUser => {
      connection.execute(
        'INSERT INTO user_message_status (user_id, chat_id, message_id, has_read) VALUES (?, ?, ?, ?)',
        [chatUser.user_id, newMessage.chat_id, insertedMsgId, 0]
      );
    }); 
  })();
}


// ALL WORK ~ TILL HERE



export async function getMessagesByChatId1(chatId: number): Promise<Message[]> {
  const [rows] = await connection.execute(
    "SELECT * FROM messages WHERE chat_id = ?",
    [chatId]
  );
  return rows as Message[];
}

export async function getMessagesByChatId(chatId: number): Promise<Message[] | void> {
  // TODO
  let res: Message[];
  async function getMessagesByChatIdHelper(chatId: number): Promise<Message[]> {
    const [rows] = await connection.execute(
      "SELECT user_id, msg_type, msg, created_on FROM messages WHERE chat_id = ?",[chatId]);
      return rows as Message[];
    }
    const promGetMsgs = new Promise((resolve, reject) => {
      resolve(getMessagesByChatIdHelper(chatId));
    });

    promGetMsgs.then((result:any) => {
      res = result;
      //PROBLEM
      // res has values here, but it does return undefined
      return res as Message[];
    })
}

export async function createChat(newChat: Chat): Promise<Chat> {
  const [result] = await connection.execute(
    "INSERT INTO chats (name) VALUES (?)",
    [newChat.name]
  );
  return { ...newChat };
}

export async function getChatById(id: number): Promise<Chat | null> {
  const [rows] = await connection.execute("SELECT * FROM chats WHERE id = ?", [
    id,
  ]);
  if (rows.length === 0) {
    return null;
  }
  return rows[0] as Chat;
}

export async function getChats(): Promise<Chat[]> {
  const [rows] = await connection.execute("SELECT * FROM chats");
  return rows as Chat[];
}


export async function getMessageById(id: number): Promise<Message | null> {
  const [rows] = await connection.execute(
    "SELECT * FROM messages WHERE id = ?",
    [id]
  );
  if (rows.length === 0) {
    return null;
  }
  return rows[0] as Message;
}



export async function createChatUser(newChatUser: ChatUser): Promise<ChatUser> {
  const [result] = await connection.execute(
    "INSERT INTO chat_users (user_id, chat_id) VALUES (?, ?)",
    [newChatUser.user_id, newChatUser.chat_id]
  );
  return result as ChatUser;
}

export const deleteChat = async (chatId: number): Promise<void> => {
  try {
    await connection.execute("DELETE FROM chat_users WHERE chat_id = ?", [
      chatId,
    ]);
    await connection.execute("DELETE FROM messages WHERE chat_id = ?", [
      chatId,
    ]);
    await connection.execute("DELETE FROM chats WHERE id = ?", [chatId]);
  } finally {
    connection.end();
  }
};

// MESSAGE OPERATIONS
async function insertMessage(message: Message): Promise<void> {
  try {
    const [result] = await connection.execute(
      "INSERT INTO messages (msg_type, msg) VALUES (?, ?)",
      [message.msg_type, message.msg]
    );
    console.log(`Inserted message with ID ${result.insertId}`);
  } finally {
    connection.end();
  }
}

export const getAllMessagesForUser = async (user: User) => {
  let result: Message;
  await connection.query(
    "SELECT msg, msg_type, created_on FROM messages WHERE user_id = ?",
    [user.id],
    (err, res) => {
      if (err) throw err;
      console.log(res);
    }
  );
};

export const getChatUsersForChat = async (chat: Chat) => {
  let result: ChatUser;
  await connection.query(
    "SELECT id FROM chat_users WHERE chat_id = ?",
    [chat.id],
    (err, res) => {
      if (err) throw err;
      console.log(res);
    }
  );
};

export const getAllMessagesForChat = async (chat: Chat) => {
  let result: Message;
  await connection.query(
    "SELECT m.msg, m.msg_type, m.created_on FROM messages m, chats c, chat_users cu WHERE c.id = ? AND cu.chat_id = c.id",
    [chat.id]
  );
};

export default connection;


/* export async function checkCredentials2(user: User) {
  // helper function for validateCredentials()
  const [result] = await connection.query(
    "SELECT password from users WHERE email = ? AND password = ?",
    [user.email, user.password]
  );
  return result[0];
}

export const validateCredentials2 = async (user: User): Promise<boolean> => {
  let res = false;

  const promValidation = new Promise((resolve, reject) => {
    resolve(checkCredentials2(user));
  });
  promValidation.then((result: any) => {
    if (result) {
      console.log("successful");
      res = true;
    } else {
      console.log("epic fail");
    }
  });
  console.log("res: " + res);
  return res;
}; */

/*

export async function getNote(id) {
  const [rows] = await connection.query(`
  SELECT * 
  FROM notes
  WHERE id = ?
  `, [id])
  return rows[0]
}
export async function createNote(title, contents) {
  const [result] = await connection.query(`
  INSERT INTO notes (title, contents)
  VALUES (?, ?)
  `, [title, contents])
  const id = result.insertId
  return getNote(id)
} */