import * as cookieParser from "cookie-parser";
import * as helmet from "helmet";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app/app.module";
import { environment } from "./environments/environment";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const PORT = app.get(ConfigService).get("API_PORT");

  /**
   * * Helmet
   *
   * Helmet sets varius HTTP headers to help provide a base layer of security.
   */
  app.use(
    helmet({
      // This feature causes an issue with the GraphQL Playground which is used in development
      // by conditionally setting the value to `undefined` we use the library's default value when in production
      contentSecurityPolicy: process.env.NODE_ENV === "production" ? undefined : false,
    }),
  );

  /**
   * * CORS
   *
   * Cross Origin Resource Sharing (CORS) is blocked by default
   * and must be explicitly enabled.
   */
  app.enableCors({
    // Allow inclusion of credentials (such as cookies and headers)
    credentials: true,
    // Allow requests from the expected Url of the client
    origin: environment.corsOrigin,
  });

  /**
   * * Cookie Parser
   *
   * Cookies must be parsed at the `express` level so they may be used in middlewares.
   */
  app.use(cookieParser());

  await app.listen(PORT);
}

bootstrap();
