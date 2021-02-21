import { BaseEntityService, User } from "@decked-out/api/orm";
import { EntityRepository } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Injectable } from "@nestjs/common";

import { CreateUserDto } from "./dto";

@Injectable()
export class UserService extends BaseEntityService<User, EntityRepository<User>> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {
    super(userRepository);
  }

  protected defaultPopulate = [];

  public async findByUsername(username: string): Promise<User> {
    try {
      const user = await this.findByUsernameOrFail(username);

      return user;
    } catch {
      return null;
    }
  }

  public async findByUsernameOrFail(username: string): Promise<User> {
    const user = await this.userRepository.findOneOrFail({ username });

    return user;
  }

  public async createAndFlush(data: CreateUserDto): Promise<User> {
    const user = this.userRepository.create({
      emailAddress: data.emailAddress,
      username: data.username,
      password: data.password,
    });

    await this.userRepository.persistAndFlush(user);

    return user;
  }
}
