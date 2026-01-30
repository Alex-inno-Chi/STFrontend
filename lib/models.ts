import { z } from "zod";
import { PhoneNumberUtil } from "google-libphonenumber";
const phoneUtil = PhoneNumberUtil.getInstance();

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = loginSchema.extend({
  username: z.string().min(3, "Username must be at least 3 characters"),
});

export const privateChatSchema = z.object({
  otherUserId: z.coerce.number({ invalid_type_error: "Select member" }),
});

export const groupChatSchema = z.object({
  name: z.string().trim().min(1, "Chat name must be at least 1 character"),
  memberIds: z.array(z.coerce.number()).min(1, "Select at least one member"),
});

export const userInfoSchema = z.object({
  avatarUrl: z.string().url("Wrong URL"),
  name: z.string().trim().min(1, "Name must be at least 1 character"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .refine(
      (phone) => phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone)),
      { message: "Wrong number", path: ["phone"] }
    ),
  birthday: z.coerce
    .date()
    .max(new Date(), { message: "Date of birth cannot be in the future" }),
});
