import * as Faker from "faker";
import { ConfigType } from "@nestjs/config";
import { CredentialsType, DecodedTokenType } from "@decked-out/api/types";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { UserService } from "@decked-out/api/user";
import { mockUser, mockUserService } from "@decked-out/api/testing";

import { AuthErrorMessage } from "../constants";
import { CredentialsService } from "../services";
import { jwtConfig } from "../config/jwt.config";

describe("CredentialsService", () => {
  let credentialsService: CredentialsService;
  let jwtService: JwtService;
  let jwtConfigReference: ConfigType<typeof jwtConfig>;

  beforeEach(async () => {
    const moduleReference = await Test.createTestingModule({
      providers: [
        { provide: "JWT_MODULE_OPTIONS", useValue: {} },
        {
          provide: jwtConfig.KEY,
          useValue: jwtConfig(),
        },
        CredentialsService,
        JwtService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    credentialsService = moduleReference.get<CredentialsService>(CredentialsService);
    jwtService = moduleReference.get<JwtService>(JwtService);
    jwtConfigReference = moduleReference.get<ConfigType<typeof jwtConfig>>(jwtConfig.KEY);
  });

  describe("createRefreshToken", () => {
    it("will return a refresh token for a user that expires in 7 days", async () => {
      //* Arrange
      const SEVEN_DAYS = 60 * 60 * 24 * 7;

      //* Act
      const result = await credentialsService.createRefreshToken(mockUser);
      const decodedResult = (await jwtService.verifyAsync(result, {
        secret: jwtConfigReference.refreshTokenSecret,
      })) as DecodedTokenType;

      //* Assert
      expect(decodedResult._version).toBe(mockUser.credentialVersion);
      expect(decodedResult.userId).toBe(mockUser.id);
      expect(decodedResult.exp - decodedResult.iat).toBe(SEVEN_DAYS);
    });
  });

  describe("verifyRefreshToken", () => {
    it("will return a decoded refresh token for a user", async () => {
      //* Arrange
      const tokenData: CredentialsType = {
        _version: mockUser.credentialVersion,
        userId: mockUser.id,
      };
      const token = await jwtService.signAsync(tokenData, {
        secret: jwtConfigReference.refreshTokenSecret,
        expiresIn: jwtConfigReference.refreshTokenLifespan,
      });

      //* Act
      const result = await credentialsService.verifyRefreshToken(token);

      //* Assert
      expect(result.userId).toBe(mockUser.id);
    });

    it("will reject the token if the user's `credentialVersion` does not match the token's `_version`", async () => {
      //* Arrange
      const tokenData: CredentialsType = {
        _version: mockUser.credentialVersion,
        userId: mockUser.id,
      };
      const token = await jwtService.signAsync(tokenData, {
        secret: jwtConfigReference.refreshTokenSecret,
        expiresIn: jwtConfigReference.refreshTokenLifespan,
      });

      // The mock user's credential version will default to less than 10
      // By setting it to a number greater than 11 the method can be expected to fail
      mockUser.credentialVersion = Faker.random.number({ min: 11 });

      //* Act
      const result = credentialsService.verifyRefreshToken(token);

      //* Assert
      await expect(result).rejects.toThrow(AuthErrorMessage.InvalidToken);
    });
  });

  describe("createAccessToken", () => {
    it("will return an access token for a user that expires in 15 minutes", async () => {
      //* Arrange
      const FIFTEEN_MINUTES = 60 * 15;

      //* Act
      const result = await credentialsService.createAccessToken(mockUser);
      const decodedResult = (await jwtService.verifyAsync(result, {
        secret: jwtConfigReference.accessTokenSecret,
      })) as DecodedTokenType;

      //* Assert
      expect(decodedResult._version).toBe(mockUser.credentialVersion);
      expect(decodedResult.userId).toBe(mockUser.id);
      expect(decodedResult.exp - decodedResult.iat).toBe(FIFTEEN_MINUTES);
    });
  });

  describe("verifyAccessToken", () => {
    it("will return a decoded access token for a user", async () => {
      //* Arrange
      const tokenData: CredentialsType = {
        _version: mockUser.credentialVersion,
        userId: mockUser.id,
      };
      const token = await jwtService.signAsync(tokenData, {
        secret: jwtConfigReference.accessTokenSecret,
        expiresIn: jwtConfigReference.accessTokenLifespan,
      });

      //* Act
      const result = await credentialsService.verifyAccessToken(token);

      //* Assert
      expect(result.userId).toBe(mockUser.id);
    });

    it("will reject the token if the user's `credentialVersion` does not match the token's `_version`", async () => {
      //* Arrange
      const tokenData: CredentialsType = {
        _version: mockUser.credentialVersion,
        userId: mockUser.id,
      };
      const token = await jwtService.signAsync(tokenData, {
        secret: jwtConfigReference.accessTokenSecret,
        expiresIn: jwtConfigReference.accessTokenLifespan,
      });

      // The mock user's credential version will default to less than 10
      // By setting it to a number greater than 11 the method can be expected to fail
      mockUser.credentialVersion = Faker.random.number({ min: 11 });

      //* Act
      const result = credentialsService.verifyAccessToken(token);

      //* Assert
      await expect(result).rejects.toThrow(AuthErrorMessage.InvalidToken);
    });
  });
});
