import { Injectable } from "@nestjs/common";

import { GraphqlAuthGuard } from "./utils/graphqlAuth.guard";

/**
 * Guard that implements the Passport JWT Strategy using an Access Token.
 */
@Injectable()
export class JwtAccessTokenGraphqlGuard extends GraphqlAuthGuard("jwtAccessToken") {}
