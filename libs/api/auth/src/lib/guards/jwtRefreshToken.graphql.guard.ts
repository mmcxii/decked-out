import { Injectable } from "@nestjs/common";

import { GraphqlAuthGuard } from "./utils/graphqlAuth.guard";

/**
 * Guard that implements the Passport JWT Strategy using a Refresh Token.
 */
@Injectable()
export class JwtRefreshTokenGraphqlGuard extends GraphqlAuthGuard("jwtRefreshToken") {}
