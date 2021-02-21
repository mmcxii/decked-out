import { Request, Response } from "express";
import { User } from "@decked-out/api/orm";

export type ContextType = {
  request: Request & {
    user: User;
  };
  response: Response;
};
