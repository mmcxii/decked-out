import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { ContextType } from "@decked-out/api/types";
import { UseGuards } from "@nestjs/common";
import { User } from "@decked-out/api/orm";

import { AuthenticationService, RegistrationService } from "./services";
import { JwtAccessTokenGraphqlGuard } from "./guards";
import { LoginDto, LoginInput, RegisterUserInput } from "./dto";

@Resolver()
export class AuthResolver {
  constructor(
    private readonly registrationService: RegistrationService,
    private readonly authenticationService: AuthenticationService,
  ) {}

  @UseGuards(JwtAccessTokenGraphqlGuard)
  @Query(() => User)
  public async currentUser(@Context() context: ContextType): Promise<User> {
    const { user } = context.request;

    return user;
  }

  @Mutation(() => User)
  public async registerUser(@Args("data") data: RegisterUserInput): Promise<User> {
    const user = await this.registrationService.registerUser(data);

    return user;
  }

  /**
   * Logs in a user with their username and password.
   */
  @Mutation(() => LoginDto)
  public async login(@Args("data") data: LoginInput, @Context() context: ContextType): Promise<LoginDto> {
    const { refreshToken, ...loginDto } = await this.authenticationService.handleLogin(data);

    if (data.shouldLoginPersist) {
      this.authenticationService.attachRefreshTokenToResponseCookie(refreshToken, context.response);
    }

    return loginDto;
  }

  /**
   * Logs out a user.
   */
  @UseGuards(JwtAccessTokenGraphqlGuard)
  @Mutation(() => String)
  public async logout(@Context() context: ContextType): Promise<string> {
    const message = this.authenticationService.handleLogout(context.request.user, context.response);

    return message;
  }
}
