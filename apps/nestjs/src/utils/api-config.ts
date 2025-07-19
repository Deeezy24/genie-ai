import axios from "axios";

export const LemonSqueezyInstance = axios.create({
  baseURL: process.env.LEMON_SQUEEZY_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
