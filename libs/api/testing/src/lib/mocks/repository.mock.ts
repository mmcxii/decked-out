// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function mockRepository<T>(entities: T[], overrides?: any): any {
  return {
    async findOneOrFail(condition: any): Promise<T> {
      const entity = entities.find((item) => {
        for (const property in condition) {
          if (Object.prototype.hasOwnProperty.call(condition, property)) {
            if (item[property] === condition[property]) {
              return item;
            }
          }
        }

        return null;
      });

      if (!entity) {
        throw new Error("Not found.");
      }

      return entity;
    },
    async findOne(condition: any): Promise<T> {
      const entity = entities.find((item) => {
        for (const property in condition) {
          if (Object.prototype.hasOwnProperty.call(condition, property)) {
            if (item[property] === condition[property]) {
              return item;
            }
          }
        }

        return null;
      });

      if (!entity) {
        return null;
      }

      return entity;
    },
    async findAll(): Promise<T[]> {
      return entities;
    },
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    persistAndFlush: async (): Promise<void> => {},
    find: async (): Promise<T[]> => {
      return entities;
    },
    ...overrides,
  };
}
