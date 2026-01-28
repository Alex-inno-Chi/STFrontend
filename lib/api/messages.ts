"use client";
import { toast } from "react-toastify";
import { GET, POST, DELETE } from "./client";
import { ApiEndpoints } from "./api-endpoints";
import { Message, APIMessage } from "../types";

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

export const sendMessageAPI = async (
  payload: SendMessageData
): Promise<Message | null> => {
  try {
    const response = await POST(ApiEndpoints.MESSAGES(""), payload);
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

export const deleteMessageAPI = async (
  payload: DeleteMessageData
): Promise<APIMessage | null> => {
  try {
    const response = await DELETE(ApiEndpoints.MESSAGES(""), payload);
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
