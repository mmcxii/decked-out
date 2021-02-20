import * as Bcrypt from "bcrypt";
import { Injectable } from "@nestjs/common";
import { NotFoundError } from "@mikro-orm/core";
import { UserErrorMessage } from "@decked-out/api/user";

@Injectable()
export class PasswordService {
  /**
   * Hashes a plain text password and returns the result.
   */
  public async hash(password: string): Promise<string> {
    const hashedPassword = await Bcrypt.hash(password, 12);

    return hashedPassword;
  }

  /**
   * Compares a plain text value with a hashed password and throws an error if the passwords do not match.
   */
  public async verify(password: string, hash: string): Promise<void> {
    // Determine if the provided password matches the password stored in the database
    const isPasswordCorrect = await Bcrypt.compare(password, hash);

    // If the passwords do not match reject the request but do not tell the user the password was incorrect
    if (!isPasswordCorrect) {
      throw new NotFoundError(UserErrorMessage.NotFound);
    }
  }
}
