import { registerAs } from "@nestjs/config";

/**
 * JWT module configuration.
 */
export const jwtConfig = registerAs("jwt", (): {
  accessTokenSecret: string;
  accessTokenLifespan: string;
  refreshTokenSecret: string;
  refreshTokenCookie: string;
  refreshTokenLifespan: string;
} => {
  return {
    accessTokenSecret: process.env.AUTH__ACCESS_TOKEN_SECRET,
    accessTokenLifespan: "15m",
    refreshTokenSecret: process.env.AUTH__REFRESH_TOKEN_SECRET,
    refreshTokenCookie: process.env.AUTH__REFRESH_TOKEN_COOKIE,
    refreshTokenLifespan: "7d",
  };
});
