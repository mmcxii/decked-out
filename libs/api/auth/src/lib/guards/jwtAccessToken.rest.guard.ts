import { AuthGuard } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";

/**
 * Guard that implements the Passport JWT Strategy using an Access Token.
 * Uses the default `@nestjs/passport` AuthGuard instead of the custom `GraphqlAuthGuard`.
 */
@Injectable()
export class JwtAccessTokenRestGuard extends AuthGuard("jwtAccessToken") {}
