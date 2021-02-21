import { ConfigType } from "@nestjs/config";
import { DecodedTokenType } from "@decked-out/api/types";
import { Inject } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, StrategyOptions } from "passport-jwt";
import { User } from "@decked-out/api/orm";
import { UserService } from "@decked-out/api/user";

import { jwtConfig } from "../config/jwt.config";

/**
 * Passport strategy for authenticating users using a JWT as a Refresh Token, stored in a cookie.
 * The strategy is referenced by the name `jwtRefreshToken`.
 */
export class RefreshTokenStrategy extends PassportStrategy(Strategy, "jwtRefreshToken") {
  constructor(
    @Inject(jwtConfig.KEY)
    protected readonly config: ConfigType<typeof jwtConfig>,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: (request) => {
        const cookie = request.cookies[config.refreshTokenCookie];

        return cookie;
      },
      ignoreExpiration: false,
      secretOrKey: config.refreshTokenSecret,
    } as StrategyOptions);
  }

  public async validate(payload: DecodedTokenType): Promise<User> {
    const user = await this.userService.findByIdOrFail(payload.userId);

    return user;
  }
}
