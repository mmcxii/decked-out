import { User } from "@decked-out/api/orm";

export class UserAndTokensDto {
  public user: User;

  public accessToken: string;

  public refreshToken: string;
}
