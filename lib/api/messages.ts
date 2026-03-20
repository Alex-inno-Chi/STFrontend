"use client";
import { toast } from "react-toastify";
import { GET, POST, DELETE } from "./client";
import { ApiEndpoints } from "./api-endpoints";
import { Message } from "../types";

export interface SendMessageData {
  chatId: number;
  content: string;
}

export interface DeleteMessageData {
  chatId: number;
  id: number;
}

export const getMessagesAPI = async (
  chatId: number
): Promise<Message[] | null> => {
  try {
    const response = await GET(ApiEndpoints.MESSAGES(String(chatId)));
    
    if (response.ok) {
      return response.data;
    }

    toast.error(`Error: ${response.message}`);

    return null;
  } catch (error) {
    toast(`Error: ${error}`);
    
    return null;
  }
};

export const sendMessageAPI = async(
  chatId:number,
  content: string
): Promise<Message | null> => {
  try {
    const response = await POST(ApiEndpoints.MESSAGES(String(chatId)),{content});
    
    if (response.ok) {
      return response.data;
    }

    toast.error(`Error: ${response.message}`);
    
    return null;
  } catch (error) {
    toast(`Error: ${error}`);
    
    return null;
  }
}

export const deleteMessageAPI = async(
  chatId:number,
  messageId: number
): Promise<boolean> => {
  try {
    const response = await DELETE(ApiEndpoints.MESSAGES(String(chatId)), String(messageId));
    
    if (response.ok) {
      return response.data;
    }

    toast.error(`Error: ${response.message}`);
    
    return false;
  } catch (error) {
    toast(`Error: ${error}`);
    
    return false;
  }
}