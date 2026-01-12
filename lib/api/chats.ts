"use client";
import { toast } from "react-toastify";
import { GET, POST } from "./client";
import { ApiEndpoints } from "./api-endpoints";
import { Chat } from "../types";

export interface CreatePrivateChatData {
  otherUserId: number;
}

export interface CreateGroupChatData {
  name: string;
  memberIds: number[];
}

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

export const createPrivateChatApi = async (
  payload: CreatePrivateChatData
): Promise<Chat | null> => {
  try {
    const response = await POST(ApiEndpoints.PRIVATE_CHATS, payload);
    if (response.ok) {
      toast.success(`Private chat created!`);
      return response.data;
    }
    toast.error(`Error: ${response.message}`);
    return null;
  } catch (error) {
    toast(`Error: ${error}`);
    return null;
  }
};

export const createGroupChatApi = async (
  payload: CreateGroupChatData
): Promise<Chat | null> => {
  try {
    const response = await POST(ApiEndpoints.GROUP_CHATS, payload);
    if (response.ok) {
      toast.success(`Group chat created!`);
      return response.data;
    }
    toast.error(`Error: ${response.message}`);
    return null;
  } catch (error) {
    toast(`Error: ${error}`);
    return null;
  }
};
