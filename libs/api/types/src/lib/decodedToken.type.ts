import { CredentialsType } from "./credentials.type";

export type DecodedTokenType = CredentialsType & {
  iat: number;
  exp: number;
};
