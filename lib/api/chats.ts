"use client";
import { toast } from "react-toastify";
import { GET, PATCH, DELETE } from "./client";
import { ApiEndpoints } from "./api-endpoints";
import { Chat } from "../types";

export const getChatsAPI = async (): Promise<Chat[] | null> => {
  try {
    const response = await GET(ApiEndpoints.CHATS(""));
   
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

export const updateChatAPI = async (chatId: number, chatName: {name?: string}): Promise<Chat | null> => {
  try{
    const response = await PATCH(ApiEndpoints.CHATS(String(chatId)), chatName)

    if (response.ok) {
      return response.data;
    }
   
    toast.error(`Error: ${response.message}`);

    return null;
  }catch(error){
    toast(`Error: ${error}`);

    return null;
  }
}

export const deleteChatAPI = async (chatId: number): Promise<boolean> => {
  try{
    return false;
  }catch(error){
    return false;
  }
}
