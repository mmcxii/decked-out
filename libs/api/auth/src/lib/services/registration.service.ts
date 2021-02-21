import { Injectable } from "@nestjs/common";
import { User } from "@decked-out/api/orm";
import { UserService } from "@decked-out/api/user";

import { AuthErrorMessage } from "../constants";
import { PasswordService } from "./password.service";
import { RegisterUserInput } from "../dto";

@Injectable()
export class RegistrationService {
  constructor(private readonly passwordService: PasswordService, private readonly userService: UserService) {}

  public async registerUser(input: RegisterUserInput): Promise<User> {
    const isUsernameInUse = !!(await this.userService.findByUsername(input.username));

    if (isUsernameInUse) {
      throw new Error(AuthErrorMessage.UsernameIsAlreadyInUse);
    }

    const hashedPassword = await this.passwordService.hash(input.password);

    const user = await this.userService.createAndFlush({ ...input, password: hashedPassword });

    return user;
  }
}
