export interface User {
  id?: number;
  username?: string;
  email: string;
  password: string;
  is_admin?: number;
  created_on?: string;
}

export interface Chat {
  id: number;
  name: string;
  created_on: string;
}
export interface Message {
  id: number;
  user_id?: number;
  chat_id?: number;
  msg_type: number;
  msg: string;
  created_on?: string;
}

export interface ChatUser {
  id: number;
  user_id?: number;
  chat_id?: number;
  username: string;
  password: string;
  email: string;
}

export interface UserMessageStatus {
  id: number;
  user_id?: number;
  chat_id?: number;
  message_id: number;
  has_read: boolean;
}