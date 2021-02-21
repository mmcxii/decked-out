import * as Faker from "faker";
import { Test } from "@nestjs/testing";
import { UserService } from "@decked-out/api/user";
import { mockCredentialsService, mockUser, mockUserService } from "@decked-out/api/testing";

import { AuthErrorMessage } from "../constants/errorMessage";
import { CredentialsService, PasswordService, RegistrationService } from "../services";
import { RegisterUserInput } from "../dto";

describe("RegistrationService", () => {
  let registrationService: RegistrationService;

  beforeEach(async () => {
    const moduleReference = await Test.createTestingModule({
      providers: [
        RegistrationService,
        PasswordService,
        {
          provide: CredentialsService,
          useValue: mockCredentialsService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    registrationService = moduleReference.get<RegistrationService>(RegistrationService);
  });

  describe("registerUser", () => {
    it("will create a new user if all checks pass", async () => {
      //* Arrange
      const data: RegisterUserInput = {
        username: Faker.internet.userName(),
        password: Faker.internet.password(),
        emailAddress: Faker.internet.email(),
      };

      //* Act
      const result = await registrationService.registerUser(data);

      //* Assert
      expect(result).toBeDefined();
    });

    it("will throw an error if the requested username is already in use", async () => {
      //* Arrange
      const data: RegisterUserInput = {
        username: mockUser.username,
        password: Faker.internet.password(),
        emailAddress: Faker.internet.email(),
      };

      //* Act
      const result = registrationService.registerUser(data);

      //* Assert
      await expect(result).rejects.toThrow(AuthErrorMessage.UsernameIsAlreadyInUse);
    });
  });
});
