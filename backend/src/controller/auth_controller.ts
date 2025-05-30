import { NextFunction } from "express";
import {
  clearAuthCookies,
  getAccessTokenCookieOptions,
  getRefreshTokenCookieOptions,
  setAuthCookies,
} from "../utils/cookies";
import { Request, Response } from "express";
import { CREATED, OK } from "../constants/http";
import {
  createAccount,
  loginAccount,
  logoutAccount,
  refreshUserAccessToken,
  verifyEmail,
} from "../service/auth_service";
import { loginSchema, registerSchema, verificationSchema } from "./auth_schema";
import { signToken, verifytoken } from "../utils/jwt";
import SessionModel from "../models/session_model";

export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password, userAgent } = registerSchema.parse({
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
) => {
  try {
    const accessToken = req.cookies.accessToken;

    const { payload } = verifytoken(accessToken);

    if (!payload || !payload.sessionId) {
      res.status(400).json({ message: "Invalid session" });
    }

    const sessionId = payload.sessionId;

    await SessionModel.findByIdAndDelete(sessionId);

    return clearAuthCookies(res)
      .status(200)
      .json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

export const refreshController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    const { accessToken, newRefreshToken } =
      await refreshUserAccessToken(refreshToken);

    if (newRefreshToken) {
      res.cookie(
        "refreshToken",
        newRefreshToken,
        getRefreshTokenCookieOptions()
      );
    }
    return res
      .status(OK)
      .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
      .json({ message: "Access token refreshed" });
  } catch (error) {
    next(error);
  }
};

export const verifyController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const verificationCode = verificationSchema.parse(req.params.code);

    const result = await verifyEmail(verificationCode);

    return res.status(OK).json({
      result,
      message: "User verified successfully",
    });
  } catch (error) {
    next(error);
  }
};
