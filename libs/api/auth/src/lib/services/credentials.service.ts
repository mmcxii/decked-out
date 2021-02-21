import { ConfigType } from "@nestjs/config";
import { CredentialsType, DecodedTokenType } from "@decked-out/api/types";
import { Inject, Injectable } from "@nestjs/common";
import { JwtService, JwtSignOptions, JwtVerifyOptions } from "@nestjs/jwt";
import { User } from "@decked-out/api/orm";
import { UserService } from "@decked-out/api/user";

import { AuthErrorMessage } from "../constants";
import { jwtConfig } from "../config/jwt.config";

@Injectable()
export class CredentialsService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly config: ConfigType<typeof jwtConfig>,
    private readonly userService: UserService,
  ) {}

  /**
   * Creates a refresh token for a user that will expire in seven (7) days.
   */
  public async createRefreshToken(user: User): Promise<string> {
    const token = await this._createToken(user, {
      secret: this.config.refreshTokenSecret,
      expiresIn: this.config.refreshTokenLifespan,
    });

    return token;
  }

  /**
   * Verifies a refresh token by decoding the token and then confirming that
   * the token's version matches the user's credential version.
   */
  public async verifyRefreshToken(token: string): Promise<DecodedTokenType> {
    const decodedToken = this._verifyToken(token, {
      secret: this.config.refreshTokenSecret,
    });

    return decodedToken;
  }

  /**
   * Creates a refresh token for a user that will expire in fifteen (15) minutes.
   */
  public async createAccessToken(user: User): Promise<string> {
    const token = this._createToken(user, {
      secret: this.config.accessTokenSecret,
      expiresIn: this.config.accessTokenLifespan,
    });

    return token;
  }

  /**
   * Verifies an access token by decoding the token and then confirming that
   * the token's version matches the user's credential version.
   */
  public async verifyAccessToken(token: string): Promise<DecodedTokenType> {
    const decodedToken = this._verifyToken(token, {
      secret: this.config.accessTokenSecret,
    });

    return decodedToken;
  }

  /**
   * Common functionality used for creating tokens.
   */
  private async _createToken(user: User, options: JwtSignOptions): Promise<string> {
    const credentialData: CredentialsType = {
      _version: user.credentialVersion,
      userId: user.id,
    };

    const signed = await this.jwtService.signAsync(credentialData, options);

    return signed;
  }

  /**
   * Common functionality used for verifying tokens.
   */
  private async _verifyToken(token: string, options: JwtVerifyOptions): Promise<DecodedTokenType> {
    const decodedToken = (await this.jwtService.verifyAsync(token, options)) as DecodedTokenType;

    // Find the user the token belongs to
    const user = await this.userService.findByIdOrFail(decodedToken.userId);

    // If the user's credential version does not match the token's version
    // the token should be regarded as compromised and invalid
    if (user.credentialVersion !== decodedToken._version) {
      throw new Error(AuthErrorMessage.InvalidToken);
    }

    return decodedToken;
  }
}
