import { Field, InputType } from "@nestjs/graphql";

@InputType("LoginInput")
export class LoginInput {
  @Field(() => String)
  public username: string;

  @Field(() => String)
  public password: string;

  @Field(() => Boolean)
  public shouldLoginPersist: boolean;
}
