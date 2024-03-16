import { Request, Response } from "express";
import { UNAUTHORIZED } from "../Resources/Constants/StatusCodes";
import AuthService from "./AuthService";
import { APP_ENV } from "../Resources/Constants/env";

const BEARER_PREFIX = "Bearer ";
const AUTH_COOKIE_NAME = "pm_secure_token";

class AuthController {
  static instance: AuthController | null = null;

  static getInstance(): AuthController {
    if (!AuthController.instance) {
      AuthController.instance = new AuthController();
    }

    return AuthController.instance;
  }

  private constructor() { }

  async signIn(req: Request, res: Response) {
    const authHeader = req.headers.authorization;

    if (!authHeader) return res.status(UNAUTHORIZED).json({ message: "Authorization Required" });

    try {
      const authToken = authHeader.slice(BEARER_PREFIX.length);

      const payload = await AuthService.authenticateWithToken(authToken);

      res.cookie(AUTH_COOKIE_NAME, payload.token, {
        expires: payload.sessionExpires,
        httpOnly: true,
        secure: APP_ENV === "production",
      });

      res.status(200).json({
        message: "Token verified",
        data: {
          isAuthenticated: true,
        },
      });
    } catch (error) {
      res.status(UNAUTHORIZED).json({ message: "Invalid Token" });
    }
  }
}

export default AuthController.getInstance();