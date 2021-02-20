import { CookieOptions } from "express";

/**
 * Configuration for cookie used to carry a user's refresh token.
 */
export const refreshTokenCookieConfig: CookieOptions = {
  // Only allow cookie to be accessed over HTTP
  httpOnly: true,
  // Use HTTPS in production
  secure: process.env.NODE_ENV === "production",
  // Cookie is valid for one week after creation
  maxAge: 1000 * 60 * 60 * 24 * 7,
  // Cookie is valid for all subdomains of the host domain
  domain: process.env.NODE_ENV === "production" ? "https://deckedout.com" : "http://localhost",
};
