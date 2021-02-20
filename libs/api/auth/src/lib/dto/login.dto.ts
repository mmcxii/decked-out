import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "@decked-out/api/orm";

@ObjectType("LoginDto")
export class LoginDto {
  @Field(() => User)
  public user: User;

  @Field(() => String)
  public accessToken: string;
}
