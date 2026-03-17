"use client";
import { toast } from "react-toastify";
import { GET, PATCH, DELETE, POST } from "./client";
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
    const response = await DELETE(ApiEndpoints.CHATS(String(chatId)));
    
    if (response.ok) {
      toast.success("Chat deleted");
      return true;
    }

    toast.error(response.error ?? "Failed to delete chat");
    
    return false;
  }catch(error){
    toast.error(`Error: ${error}`);

    return false;
  }
}
export const createPrivateChatAPI = async (userId: number): Promise<Chat|null> => {
  try{
    const response = await POST(ApiEndpoints.PRIVATE_CHATS, {userId});

    if (response.ok) {
      toast.success("Private chat created");

      return response.data;
    }

    toast.error(response.error?? "Failed to create private chat");

    return null;
  }catch(error){
    toast.error(`Error: ${error}`);
    
    return null;
  }
}

export const createGroupChatAPI = async (payload:{name: string; membersIds: number[]}): Promise<Chat|null> => {
  try{
    const response = await POST(ApiEndpoints.GROUP_CHATS, payload);

    if (response.ok) {
      toast.success("Group chat created");

      return response.data;
    }

    toast.error(response.error?? "Failed to create group chat");

    return null;
  }catch(error){
    toast.error(`Error: ${error}`);
    
    return null;
  }
}
