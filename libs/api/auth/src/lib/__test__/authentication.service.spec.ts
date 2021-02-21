import * as Faker from "faker";
import {
  MOCK_USERS,
  createMockUser,
  mockCredentialsService,
  mockRepository,
  mockUser,
  mockUserService,
} from "@decked-out/api/testing";
import { Response } from "express";
import { Test } from "@nestjs/testing";
import { User } from "@decked-out/api/orm";
import { UserErrorMessage, UserService } from "@decked-out/api/user";
import { getRepositoryToken } from "@mikro-orm/nestjs";

import { AuthenticationService, CredentialsService, PasswordService } from "../services";
import { LoginInput } from "../dto";
import { jwtConfig } from "../config/jwt.config";

describe("AuthenticationService", () => {
  let authenticationService: AuthenticationService;

  beforeEach(async () => {
    const moduleReference = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        PasswordService,
        { provide: "JWT_MODULE_OPTIONS", useValue: {} },
        {
          provide: jwtConfig.KEY,
          useValue: jwtConfig(),
        },
        {
          provide: CredentialsService,
          useValue: mockCredentialsService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository(MOCK_USERS, {
            create(data: Partial<User>): User {
              return createMockUser(data);
            },
          }),
        },
      ],
    }).compile();

    authenticationService = moduleReference.get<AuthenticationService>(AuthenticationService);
  });

  describe("handleLogin", () => {
    it("will return the user and an access token if all checks pass and will send a refresh token as a cookie", async () => {
      //* Arrange
      const data: LoginInput = {
        username: mockUser.username,
        password: `password${mockUser.id}`,
        shouldLoginPersist: true,
      };

      //* Act
      const result = await authenticationService.handleLogin(data);

      //* Assert
      expect(result.user).toMatchObject(mockUser);
      expect(result.accessToken).toBeDefined();
    });

    it("will reject the request if a user cannot be found with the requested username", async () => {
      //* Arrange
      const data: LoginInput = {
        username: "AN_INVALID_USERNAME",
        password: Faker.internet.password(),
        shouldLoginPersist: Faker.random.boolean(),
      };

      //* Act
      const result = authenticationService.handleLogin(data);

      //* Assert
      await expect(result).rejects.toThrow(UserErrorMessage.NotFound);
    });

    it("will reject the request if a user enters an incorrect password", async () => {
      //* Arrange
      const data: LoginInput = {
        username: mockUser.username,
        password: "AN_INCORRECT_PASSWORD",
        shouldLoginPersist: Faker.random.boolean(),
      };

      //* Act
      const result = authenticationService.handleLogin(data);

      //* Assert
      await expect(result).rejects.toThrow(UserErrorMessage.NotFound);
    });
  });

  describe("handleLogout", () => {
    it("will log out a user by clearing the cookie containing their refresh token", () => {
      //* Arrange
      const response = ({
        clearCookie: jest.fn(),
      } as unknown) as Response;

      //* Act
      authenticationService.handleLogout(mockUser, response);

      //* Assert
      expect(response.clearCookie).toHaveBeenCalledTimes(1);
    });
  });

  describe("createNewTokens", () => {
    it("will return an access token and refreshToken", async () => {
      //* Act
      const result = await authenticationService.createNewTokens(mockUser);

      //* Assert
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });
  });
});
