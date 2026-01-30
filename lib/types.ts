export enum ChatType {
  Private = "private",
  Group = "group",
}

export interface Chat {
  chat_type: string;
  created_at: string;
  id: number;
  name: string | null;
  updated_at: string;
  created_by: User;
  members: User[];
}
export interface User {
  id: number;
  username: string;
  email: string;
  avatarUrl?: string;
  isLoading: boolean;
  name?: string;
  birthday?: string;
  phone?: string;
}

export interface Message {
  chat_id: number;
  content: string;
  edited_at?: string;
  id: number;
  is_deleted?: boolean;
  sender: User;
  sender_id: number;
  sent_at: string;
}

export interface MessageFile {
  file_id?: number;
  chat_id: number;
  message_id: number;
  path: string;
  name: string;
  size: number;
  type: string;
}

export interface APIMessage {
  message: string;
}
