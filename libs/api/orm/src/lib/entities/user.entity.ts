import { Entity, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "@nestjs/graphql";

import { BaseEntity } from "./_base.entity";

@ObjectType("User")
@Entity({
  tableName: "user",
})
export class User extends BaseEntity {
  @Field(() => String)
  @Property({
    unique: true,
  })
  public username: string;

  @Property({
    unique: true,
  })
  public emailAddress: string;

  @Property()
  public password: string;
}
