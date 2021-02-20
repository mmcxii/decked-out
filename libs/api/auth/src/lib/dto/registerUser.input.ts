import { CreateUserDto } from "@decked-out/api/user";
import { Field, InputType } from "@nestjs/graphql";

@InputType("RegisterUserInput")
export class RegisterUserInput implements CreateUserDto {
  @Field(() => String)
  public emailAddress: string;

  @Field(() => String)
  public username: string;

  @Field(() => String)
  public password: string;
}
