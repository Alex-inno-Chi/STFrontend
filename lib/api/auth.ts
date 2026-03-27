"use client";
import { toast } from "react-toastify";
import { POST, GET } from "./client";
import { ApiEndpoints } from "./api-endpoints";
import { User } from "../types";

export interface RegisterUserData {
  username: string;
  password: string;
  email: string;
}

export interface loginUserData {
  email: string;
  password: string;
}

export const registerUserAPI = async (
  payload: RegisterUserData
): Promise<User | null> => {
  try {
    const response = await POST(ApiEndpoints.REGISTER, payload);

    if (response.ok) {
      toast.success(`User created !`);

      return response.data.user;
    }

    toast.error(`Error registration failed`);

    return null;
  } catch (error) {
    toast(`Registaration error: ${error}`);

    return null;
  }
};

export const loginUserAPI = async (
  payload: loginUserData
): Promise<User | null> => {
  try {
    const response = await POST(ApiEndpoints.LOGIN_USER, payload);

    if (response.ok) {
      toast.success(`Login successful`);

      return response.data.user;
    }

    toast.error(`Error login failed`);

    return null;
  } catch (error) {
    toast(`Login error: ${error}`);

    return null;
  }
};

export const getCurrentUserAPI = async (): Promise<User | null> => {
  try {
    const response = await GET(ApiEndpoints.USER);

    if (response.ok) {
      return response.data;
    }

    return null;
  } catch (error) {
    toast(`Login error: ${error}`);

    return null;
  }
};

export const logoutUserAPI = async (): Promise<boolean> => {
  try {
    const response = await POST(ApiEndpoints.LOGOUT_USER, {});
    if (response.ok) {
      toast.success("Logged out");

      return true;
    }

    return false;
  } catch (error) {
    toast(`Login error: ${error}`);

    return false;
  }
};
