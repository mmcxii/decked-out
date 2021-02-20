import * as Bcrypt from "bcrypt";
import * as Faker from "faker";
import { User } from "@decked-out/api/orm";

export function createMockUser(overrides?: Partial<User>): User {
  const mockUser = new User();
  mockUser.id = overrides?.id || Faker.random.number();
  mockUser.createdAt = overrides?.createdAt || new Date();
  mockUser.updatedAt = overrides?.updatedAt || new Date();
  mockUser.archivedAt = overrides?.archivedAt || null;
  mockUser.credentialVersion = Faker.random.number({ min: 1, max: 10 });
  mockUser.emailAddress = overrides?.emailAddress || Faker.internet.email();
  mockUser.username = overrides?.username || Faker.internet.userName();
  mockUser.password = overrides?.password || Bcrypt.hashSync(`password${mockUser.id}`, 12);

  return mockUser;
}

export const mockUser = createMockUser();

export const mockUser2 = createMockUser();

export const MOCK_USERS = [mockUser, mockUser2];
