import { AuthGuard } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";

/**
 * Guard that implements the Passport JWT Strategy using a Refresh Token.
 * Uses the default `@nestjs/passport` AuthGuard instead of the custom `GraphqlAuthGuard`.
 */
@Injectable()
export class JwtRefreshTokenRestGuard extends AuthGuard("jwtRefreshToken") {}
