export const __prod__ = process.env.NODE_ENV === "production";
export const BASE_URL = __prod__
  ? "https://malcolms-stonks.herokuapp.com"
  : "http://localhost:5000";
