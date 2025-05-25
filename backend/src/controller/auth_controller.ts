import { NextFunction } from "express";
import { setAuthCookies } from "../utils/cookies";
import { Request, Response } from "express";
import { CREATED } from "../constants/http";
import BadRequest from "../errors/BadRequest";
import { verifyRefreshToken, verifyAccessToken } from "../utils/verify";
import {
  createAccount,
  loginAccount,
  logoutAccount,
} from "../service/auth_service";
import { loginSchema, registerSchema } from "./auth_schema";
import { verify } from "jsonwebtoken";

export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password, confirmPassword, userAgent } =
      registerSchema.parse({
        ...req.body,
        userAgent: req.get("user-agent"),
      });

    const { user, accessToken, refreshToken } = await createAccount({
      email,
      password,
      userAgent,
    });

    setAuthCookies({ res, accessToken, refreshToken })
      .status(CREATED)
      .json({ message: "Created user", user });
  } catch (error) {
    next(error);
  }
};

// loginController.ts

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Implement login logic here

    const { email, password } = loginSchema.parse({
      ...req.body,
      userAgent: req.get("user-agent"),
    });

    const { user, accessToken, refreshToken } = await loginAccount({
      email,
      password,
      userAgent: req.get("user-agent"),
    });

    setAuthCookies({ res, accessToken, refreshToken })
      .status(200)
      .json({ message: "Login successful", user });
  } catch (error) {
    next(error);
  }
};



// logoutController.ts

export const logoutController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log("Cookies received:", req.cookies);
    console.log("All headers:", req.headers);
    
    // Try to get session from either refresh token or access token
    const refreshToken = req.cookies?.refreshToken;
    const accessToken = req.cookies?.accessToken;
    
    if (!refreshToken && !accessToken) {
      throw new BadRequest("No authentication tokens found");
    }

    let sessionId: string | undefined;
    
    try {
      if (refreshToken) {
        const payload = verifyRefreshToken(refreshToken);
        sessionId = payload.sessionId;
      } else if (accessToken) {
        const payload = verifyAccessToken(accessToken);
        sessionId = payload.sessionId;
      }
    } catch (error) {
      console.error("Token verification error:", error);
    }

    if (!sessionId) {
      throw new BadRequest("Invalid authentication tokens");
    }

    // Verify refresh token and get session id
    const payload = verifyRefreshToken(refreshToken);
    if (!payload.sessionId) {
      throw new BadRequest("Invalid refresh token");
    }

    console.log("Payload from refresh token:", payload);

    // Logout the session
    await logoutAccount(payload.sessionId);    // Clear auth cookies with same options as when setting them
    res.clearCookie("accessToken", {
      ...getAccessTokenCookieOptions(),
      maxAge: 0
    });

    res.clearCookie("refreshToken", {
      ...getRefreshTokenCookieOptions(),
      maxAge: 0
    });

    res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};
function getAccessTokenCookieOptions(): import("express-serve-static-core").CookieOptions | undefined {
  throw new Error("Function not implemented.");
}

function getRefreshTokenCookieOptions(): import("express-serve-static-core").CookieOptions | undefined {
  throw new Error("Function not implemented.");
}

