"use client";
import { toast } from "react-toastify";
import { POST } from "./client";
import { ApiEndpoints } from "./api-endpoints";
import { User } from "../types";
import { createSession } from "./jwt_session";

export interface RegisterUserData {
  username: string;
  password: string;
  email: string;
}

export interface LoginUserData {
  password: string;
  email: string;
}

export const loginUserAPI = async (
  payload: LoginUserData
): Promise<User | null> => {
  try {
    const response = await POST(ApiEndpoints.LOGIN_USER, payload);

    if (response.ok) {
      toast.success(`User loged in !`);
      await createSession(response.data.user.id);
      return response.data.user;
    }
    return null;
  } catch (error) {
    toast(`Error: ${error}`);
    return null;
  }
};

export const registerUserAPI = async (
  payload: RegisterUserData
): Promise<User | null> => {
  try {
    const response = await POST(ApiEndpoints.REGISTER, payload);

    if (response.ok) {
      toast.success(`User created !`);
      await createSession(response.data.user.id);
      return response.data.user;
    }
    return null;
  } catch (error) {
    toast(`Error: ${error}`);
    return null;
  }
};
