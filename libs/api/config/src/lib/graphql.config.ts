import { ContextType } from "@decked-out/api/types";
import { GqlModuleOptions } from "@nestjs/graphql";
import { registerAs } from "@nestjs/config";

/**
 * Configuration for the `@nestjs/graphql` module.
 */
export const graphqlConfig = (production: boolean): (() => GqlModuleOptions) =>
  registerAs(
    "graphql",
    (): GqlModuleOptions => {
      return {
        path: "/graphql",
        playground: !production,
        autoSchemaFile: "./graphql/schema.graphql",
        cors: false,
        context: ({ req, res }): ContextType => {
          return {
            request: req,
            response: res,
          };
        },
      };
    },
  );
