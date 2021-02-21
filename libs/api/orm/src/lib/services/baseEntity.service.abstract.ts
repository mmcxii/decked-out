import { EntityRepository, FilterQuery, FindOptions } from "@mikro-orm/core";
import { Injectable } from "@nestjs/common";

import { BaseEntity } from "../entities/_base.entity";

/**
 * The abstract base which defines methods common to all database entity services.
 */
@Injectable()
export abstract class BaseEntityService<
  TEntity extends BaseEntity,
  TEntityRepository extends EntityRepository<TEntity>
> {
  constructor(protected readonly entityRepository: TEntityRepository) {}

  /**
   * The default properties to populate on a query to the database.
   */
  protected abstract defaultPopulate: string[];

  /**
   * Directly accesses the entity repository to allow for highly specific access.
   */
  public getRepository(): TEntityRepository {
    return this.entityRepository;
  }

  /**
   * Finds a single entity using a provided set of options.
   */
  public async findOneOrFail(options: FilterQuery<TEntity>): Promise<TEntity> {
    const entity = await this.entityRepository.findOneOrFail(options);

    return entity;
  }

  /**
   * Finds a specific entity by its ID.
   */
  public async findByIdOrFail(id: number | string, populate: string[] = this.defaultPopulate): Promise<TEntity> {
    // The `where` contstraint must be cast as `any` to avoid a type mismatch
    const entity = await this.entityRepository.findOneOrFail({ id } as any, populate);

    return entity;
  }

  /**
   * Finds all of the requested entity.
   */
  public async findAll(options?: FindOptions<TEntity>): Promise<TEntity[]> {
    const entities = await this.entityRepository.findAll(options);

    return entities;
  }
}
