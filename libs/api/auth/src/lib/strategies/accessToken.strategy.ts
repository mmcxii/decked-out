import { ConfigType } from "@nestjs/config";
import { DecodedTokenType } from "@decked-out/api/types";
import { ExtractJwt, Strategy, StrategyOptions } from "passport-jwt";
import { Inject } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { User } from "@decked-out/api/orm";
import { UserService } from "@decked-out/api/user";

import { jwtConfig } from "../config/jwt.config";

/**
 * Passport strategy for authenticating users using a JWT as an Access Token,
 * stored as a Bearer token in an Authorization header.
 * The strategy is referenced by the name `jwtAccessToken`.
 */
export class AccessTokenStrategy extends PassportStrategy(Strategy, "jwtAccessToken") {
  constructor(
    @Inject(jwtConfig.KEY)
    protected readonly config: ConfigType<typeof jwtConfig>,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.accessTokenSecret,
    } as StrategyOptions);
  }

  public async validate(payload: DecodedTokenType): Promise<User> {
    const user = await this.userService.findByIdOrFail(payload.userId);

    return user;
  }
}
