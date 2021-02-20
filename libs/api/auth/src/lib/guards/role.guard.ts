import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { ContextType } from "@barnpros/common/shared/types";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Reflector } from "@nestjs/core";
import { User, UserRole } from "@barnpros/core/database/entities";

/**
 * Guard that validates a requesting user is allowed to access a resource
 * or perform an action by comparing their role with a list of allowed roles.
 *
 * Note: This guard requires the use of the `@Roles()` decorator to set the
 * list of allowed roles.
 * This guard also must be called after the `AuthGuard` as this guard depends on
 * a user being stored in context.
 */
@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  public canActivate(context: ExecutionContext): boolean {
    // Create a context based on where this guard is executed
    const graphqlContext = GqlExecutionContext.create(context);

    // Get the list of allowd roles from the current metadata
    const roles = this.reflector.get<UserRole[]>("roles", context.getHandler());

    // If no roles are found the resource is not protected and blanket access can be permitted
    if (!roles) {
      return true;
    }

    // Access the current user
    const user = graphqlContext.getContext<ContextType>().request.user as User;

    // Compare the user's roles with the list of allowed roles,
    // if any of the user's roles are present in the list then access may be permitted
    return roles.some((r) => user.roles.includes(r));
  }
}
