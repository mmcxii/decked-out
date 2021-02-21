import { AuthModule } from "@decked-out/api/auth";
import { GraphQLModule } from "@nestjs/graphql";
import { Module } from "@nestjs/common";
import { graphqlConfig } from "@decked-out/api/config";

import { environment } from "../environments/environment";

@Module({
  imports: [
    //* Nestjs Modules
    GraphQLModule.forRootAsync({
      useFactory: graphqlConfig(environment.production),
    }),
    //* Decked Out Modules
    AuthModule,
  ],
})
export class AppModule {}
