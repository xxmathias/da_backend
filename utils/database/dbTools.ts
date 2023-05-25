import { User, Chat, Message, ChatUser } from "../../index.interface";
import mysql from "mysql2";

export const connection = mysql.createPool({
    host: "100.103.227.61",
    user: "diplom",
    password: "password",
    database: "test",
  }).promise();

export const validateCredentials = async (user: User): Promise<boolean> => {
  const [result] = await connection.query(
    "SELECT password from users WHERE email = ? AND password = ?",
    [user.email, user.password]
  );
  return result[0] ? true : false;
};

export async function createUser(newUser: User): Promise<void> {
  // checks if provided email already exists, if not -> new user gets created
  async function createUserHelper(email: string) {
    // checks if provided email already exists
    const [rows] = await connection.query(
    `SELECT email
    FROM users
    WHERE email = ?
    `,
      [email]
    );
    return rows[0];
  }
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
  const [rows] = await connection.execute("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  if (!rows) {
    return null;
  }
  return rows[0] as User;
}

export async function getMessagesByChatId(chatId: number): Promise<Message[]> {
  const [rows] = await connection.execute(
    "SELECT * FROM messages WHERE chat_id = ?",
    [chatId]
  );
  const messages = await Promise.all(rows.map(async (row) => {
    const user = await getUserById(row.user_id);
    return {...row, username: user.username};
  }));
  return messages;
}

// ALL WORK TILL HERE


export async function createChat(chatName: String): Promise<Chat> {
  const [result] = await connection.execute(
    "INSERT INTO chats (name) VALUES (?)",
    [chatName]
  );
  return result as Chat;
}

export async function deleteChat(chatId: Number): Promise<String> {
  const [res] = await connection.query(
    "SELECT id FROM chats WHERE id = ?",[chatId]
  )
  if (res.id != undefined) {
    try {
      await connection.execute("DELETE FROM chat_users WHERE chat_id = ?", [chatId,]);
      await connection.execute("DELETE FROM messages WHERE chat_id = ?", [chatId,]);
      await connection.execute("DELETE FROM chats WHERE id = ?", [chatId]);
    } finally {
      connection.end();
    }
    return "Successfully deleted Chat"
  } else {
    return `There is no Chat with id ${chatId}`
  }
};

export async function addUserToChat(userId: Number, chatId: Number) {
  // checks if user already exists in chat and if he isn't, it adds user to chat
  const [res] = await connection.query(
    "SELECT id FROM chat_users WHERE user_id = ?",[userId]
  )
  if(res.id != undefined) {
    const [result] = await connection.execute(
      "INSERT INTO chat_users (user_id, chat_id) VALUES (?, ?)"
      ,[userId, chatId])
    return "Successfully added User to Chat.";
  } else {
    return "User already in Chat";
  }
}

export async function removeUserFromChat(userId: Number, chatId: Number) {
  // checks if user is in chat and if so, removes him
  // his messages stay in the chat
  const [res] = await connection.query(
    "SELECT id FROM chat_users WHERE user_id = ?",[userId]
  )
  if(res.id != undefined) {
    const [result] = connection.execute("DELETE FROM chat_users WHERE user_id = ? AND chat_id = ?"
    , [userId, chatId])
    return "Successfully deleted User from Chat"
  } else {
    return "User is not in Chat";
  }
}

export async function getChatById(id: number): Promise<Chat | String> {
  const [rows] = await connection.execute("SELECT * FROM chats WHERE id = ?", [
    id,
  ]);
  if (rows.length === 0) {
    return "No Chats for given Id found";
  }
  return rows[0] as Chat;
}

export async function getChatsByUserId(user_id: number) : Promise <Chat[] | String> {
  const [rows] = await connection.execute
  ("SELECT c.id, c.name, c.created_on, c.last_message FROM chats c, chat_users cu WHERE cu.chat_id = c.id AND cu.user_id = ?", [user_id]);
  if (rows.length === 0) {
    return "No Chats for given User found";
  }
  return rows as Chat[];
}

export async function getAllChats(): Promise<Chat[]> {
  const [rows] = await connection.execute("SELECT * FROM chats");
  return rows as Chat[];
}

export async function sendMessage(newMessage: Message): Promise<Message> {
  const [result] = await connection.execute(
    "INSERT INTO messages (user_id, chat_id, msg_type, msg) VALUES (?, ?, ?, ?)",
    [
      newMessage.user_id,
      newMessage.chat_id,
      newMessage.msg_type,
      newMessage.msg,
    ]
  );
  const [res] = await connection.execute("UPDATE chats SET last_message = ? WHERE chats.id = ?", [newMessage.msg, newMessage.chat_id]);
  return { ...newMessage, id: result.insertId };
}


export async function getMessageById(id: number): Promise<Message | String> {
  const [rows] = await connection.execute(
    "SELECT * FROM messages WHERE id = ?",
    [id]
  );
  if (rows.length === 0) {
    return "No Message found for given Id";
  }
  return rows[0] as Message;
}



export async function createChatUser(newChatUser: ChatUser): Promise<ChatUser> {
  const [rows] = await connection.execute(
    "INSERT INTO chat_users (user_id, chat_id) VALUES (?, ?)",
    [newChatUser.user_id, newChatUser.chat_id]
  );
  return rows as ChatUser;
}

export async function getAllMessagesForUser(user: User): Promise<Message[]> {
  let result: Message;
  const [rows] = await connection.query(
    "SELECT msg, msg_type, created_on FROM messages WHERE user_id = ?",
    [user.id],
    );
    return rows as Message[];
};

export async function getChatUsersForChat(chatId: Number): Promise<Number[]> {
  let result: ChatUser;
  const [rows] = await connection.query(
    "SELECT user_id FROM chat_users WHERE chat_id = ?",
    [chatId]
  );
  return rows as Number[];
};


export async function getAllMessagesForChat(chat: Chat): Promise<Chat> {
  const [rows] = await connection.query(
    "SELECT m.msg, m.msg_type, m.created_on FROM messages m, chats c, chat_users cu WHERE c.id = ? AND cu.chat_id = c.id",
    [chat.id]
  );
  return rows as Chat;
};


export default connection;
