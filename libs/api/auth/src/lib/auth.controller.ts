import { Controller, Get, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from "express";
import { User } from "@decked-out/api/orm";

import { AuthenticationService } from "./services";
import { JwtRefreshTokenRestGuard } from "./guards";

@Controller("/api/auth")
export class AuthController {
  constructor(private readonly authService: AuthenticationService) {}

  /**
   * Route:  /api/auth/refreshTokens
   * Method: GET
   *
   * Will return a set of access and refresh tokens if a user has a valid refresh token.
   */
  @UseGuards(JwtRefreshTokenRestGuard)
  @Get("/refresh-tokens")
  public async refreshTokens(@Req() request: Request, @Res() response: Response): Promise<Response> {
    const { accessToken, refreshToken } = await this.authService.createNewTokens(request.user as User);

    this.authService.attachRefreshTokenToResponseCookie(refreshToken, response);

    return response.json({
      accessToken,
    });
  }
}
