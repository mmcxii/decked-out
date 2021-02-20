import { CustomDecorator, SetMetadata } from "@nestjs/common";
import { UserRole } from "@barnpros/core/database/entities";

/**
 * Decorator that assigns any number of User Roles as metadata, to be used in
 * conjunction with the Role Guard to restrict access to certain features.
 */
export function Roles(...roles: UserRole[]): CustomDecorator<string> {
  // Set the provided list of roles to a variable `roles` in the metadata
  return SetMetadata("roles", roles);
}
