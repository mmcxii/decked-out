import { User } from "@decked-out/api/orm";
import { UserErrorMessage } from "@decked-out/api/user";

import { MOCK_USERS, createMockUser } from "./user.mock";
import { mockRepository } from "./repository.mock";

export const mockUserService = {
  findAll: async (): Promise<User[]> => {
    return MOCK_USERS;
  },
  findByIdOrFail: async (id: number): Promise<User> => {
    const user = MOCK_USERS.find((u) => u.id === id);

    if (!user) {
      throw new Error(UserErrorMessage.NotFound);
    }

    return user;
  },
  findByUsername: async (username: string): Promise<User> => {
    const user = MOCK_USERS.find((u) => u.username === username);

    if (!user) {
      return null;
    }

    return user;
  },
  findByUsernameOrFail: async (username: string): Promise<User> => {
    const user = MOCK_USERS.find((u) => u.username === username);

    if (!user) {
      throw new Error(UserErrorMessage.NotFound);
    }

    return user;
  },
  createAndFlush: async (): Promise<User> => {
    return createMockUser();
  },
  getRepository: (): any => {
    return mockRepository(MOCK_USERS);
  },
};
