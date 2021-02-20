import { AuthGuard } from "@nestjs/passport";
import { ContextType } from "@barnpros/common/shared/types";
import { ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Request } from "express";
import { User } from "@barnpros/core/database/entities";

/**
 * Replaces the default `AuthGuard` from `@nestjs/passport` to
 * extract the request from a GraphQL execution context.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function GraphqlAuthGuard(type: string | string[]): any {
  return class GqlAuthGuard extends AuthGuard(type) {
    public getRequest(
      context: ExecutionContext,
    ): Request & {
      user: User;
    } {
      return GqlExecutionContext.create(context).getContext<ContextType>().request;
    }
  };
}
