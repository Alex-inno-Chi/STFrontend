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

export interface APIMessage {
  message: string;
}

export interface Postcard {
  id: number;
  path: string;
  name: string;
  description: string;
  buyCost: number;
  sellCost: number;
}

export interface UserPostcards {
  user_id: number;
  money: number;
  postcards: BoughtPostcards[];
}

export interface BoughtPostcards {
  postcard: Postcard;
  amount: number;
}

export interface MoneyTariff {
  id: number;
  thisMoney: number;
  realMoney: number;
}
