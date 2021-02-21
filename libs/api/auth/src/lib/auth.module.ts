import { Module } from "@nestjs/common";
import { UserModule } from "@decked-out/api/user";

import { AccessTokenStrategy, RefreshTokenStrategy } from "./strategies";
import { AuthController } from "./auth.controller";
import { AuthResolver } from "./auth.resolver";
import { PasswordService, RegistrationService } from "./services";

@Module({
  imports: [
    //* Decked Out Modules
    UserModule,
  ],
  controllers: [
    //* HTTP Controllers
    AuthController,
  ],
  providers: [
    //* Passport Strategies
    AccessTokenStrategy,
    RefreshTokenStrategy,
    //* Services
    PasswordService,
    RegistrationService,
    //* Resolvers
    AuthResolver,
  ],
})
export class AuthModule {}
