import { Module } from "@nestjs/common";
import { OrmModule } from "@decked-out/api/orm";

import { UserService } from "./user.service";

@Module({
  imports: [
    //* Decked Out Modules
    OrmModule,
  ],
  providers: [
    //* Services
    UserService,
  ],
  exports: [UserService],
})
export class UserModule {}
