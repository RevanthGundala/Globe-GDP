"use server";
import { User } from "../types";

// utils/fetchUsers.js
export const fetchUsers = async () => {
  // Generate random users with profile pictures
  const users: User[] = Array.from({ length: 10 }, (_, index) => ({
    username: `User${index + 1}`,
    latitude: Number((Math.random() * 180 - 90).toFixed(6)), // Convert to number
    longitude: Number((Math.random() * 360 - 180).toFixed(6)), // Add longitude conversion
    profilePicture: "/favicon.ico",
  }));

  return users;
};
