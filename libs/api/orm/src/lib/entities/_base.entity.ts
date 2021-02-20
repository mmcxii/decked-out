import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType({
  isAbstract: true,
})
@Entity({
  abstract: true,
})
export class BaseEntity {
  @Field(() => ID)
  @PrimaryKey()
  public id: number;

  @Property({
    onCreate: () => new Date(),
  })
  public createdAt: Date;

  @Property({
    onCreate: () => new Date(),
    onUpdate: () => new Date(),
  })
  public updatedAt: Date;

  @Property({
    nullable: true,
  })
  public archivedAt: Date;
}
