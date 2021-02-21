import * as Bcrypt from "bcrypt";
import * as Faker from "faker";
import { Test } from "@nestjs/testing";
import { UserErrorMessage } from "@decked-out/api/user";

import { PasswordService } from "../services";

describe("PasswordService", () => {
  let passwordService: PasswordService;

  beforeEach(async () => {
    const moduleReference = await Test.createTestingModule({
      providers: [PasswordService],
    }).compile();

    passwordService = moduleReference.get<PasswordService>(PasswordService);
  });

  describe("hash", () => {
    it("will return a hashed password", async () => {
      //* Arrange
      const password = Faker.internet.password();

      //* Act
      const hashedPassword = await passwordService.hash(password);

      const result = await Bcrypt.compare(password, hashedPassword);

      //* Assert
      expect(result).toBe(true);
    });
  });

  describe("verify", () => {
    it("will return `true` if the password matches the hashed password", async () => {
      //* Arrange
      const password = Faker.internet.password();

      const hashedPassword = await Bcrypt.hash(password, 12);

      //* Act
      const result = passwordService.verify(password, hashedPassword);

      //* Assert
      await expect(result).resolves.toBe(undefined);
    });

    it("will throw an error if the passwords do not match", async () => {
      //* Arrange
      // By providing a different length for each random password they are
      // guarenteed to be different
      const password = Faker.internet.password(5);
      const differentPassword = Faker.internet.password(6);

      const hashedDifferentPassword = await Bcrypt.hash(differentPassword, 12);

      //* Act
      const result = passwordService.verify(password, hashedDifferentPassword);

      //* Assert
      await expect(result).rejects.toThrow(UserErrorMessage.NotFound);
    });
  });
});
