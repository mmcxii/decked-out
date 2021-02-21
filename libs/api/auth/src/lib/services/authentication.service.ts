import { ConfigType } from "@nestjs/config";
import { Inject } from "@nestjs/common";
import { Response } from "express";
import { User } from "@decked-out/api/orm";
import { UserService } from "@decked-out/api/user";

import { CredentialsService } from "./credentials.service";
import { LoginInput, UserAndTokensDto } from "../dto";
import { PasswordService } from "./password.service";
import { jwtConfig } from "../config/jwt.config";
import { refreshTokenCookieConfig } from "../config/refreshTokenCookie.config";

export class AuthenticationService {
  constructor(
    private readonly credentialsService: CredentialsService,
    private readonly passwordService: PasswordService,
    private readonly userService: UserService,
    @Inject(jwtConfig.KEY)
    private readonly config: ConfigType<typeof jwtConfig>,
  ) {}

  /**
   * Attempts to log in a user by confirming their username and password.
   * If the credentials are valid a new set of tokens will be created.
   */
  public async handleLogin(data: LoginInput): Promise<UserAndTokensDto> {
    // Find the user attempting to log in
    const user = await this.userService.findByUsernameOrFail(data.username);

    // Determine if the provided password matches the password stored in the database
    await this.passwordService.verify(data.password, user.password);

    // Create an access token for the user
    const { accessToken, refreshToken } = await this.createNewTokens(user);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Logs out a user by clearing the cookie containing
   * their refresh token from the response object.
   */
  public handleLogout(user: User, response: Response): string {
    response.clearCookie(this.config.refreshTokenCookie);

    return `Goodbye, ${user.username}.`;
  }

  /**
   * Creates a new set of access and refresh tokens for a user,
   * returns the user and the created tokens.
   */
  public async createNewTokens(user: User): Promise<UserAndTokensDto> {
    const [accessToken, refreshToken] = await Promise.all([
      this.credentialsService.createAccessToken(user),
      this.credentialsService.createRefreshToken(user),
    ]);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Configures a response object to include a refresh token in a cookie.
   */
  public attachRefreshTokenToResponseCookie(refreshToken: string, response: Response): void {
    response.cookie(this.config.refreshTokenCookie, refreshToken, refreshTokenCookieConfig);
  }
}
