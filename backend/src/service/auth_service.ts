import { now } from "mongoose";
import VerificationCodeType from "../constants/varificationcodeType";
import BadRequest from "../errors/BadRequest";
import InternalServerError from "../errors/InternalServerError";
import SessionModel from "../models/session_model";
import UserModel from "../models/user_model";
import VerificationCodeModel from "../models/varificationCode_model";
import {
  oneDayInMilliseconds,
  oneYearFromNow,
  thirthydayfromNow,
} from "../utils/date";
import {
  RefreshTokenPayload,
  refreshTokenSignOptions,
  signToken,
  verifytoken,
} from "../utils/jwt";

type createUser = {
  email: string;
  password: string;
  userAgent?: string;
};

export const createAccount = async (data: createUser) => {
  try {
    const existiongUser = await UserModel.exists({ email: data.email });
    if (existiongUser) {
      throw new BadRequest("Email already in use");
    }

    const user = await UserModel.create({
      email: data.email,
      password: data.password,
    });

    console.log("User created successfully:", user);
    const verification = await VerificationCodeModel.create({
      userId: user._id,
      type: VerificationCodeType.EmailVarification, // Assuming this is the type for email verification
      expiresAt: oneYearFromNow(),
    });

    console.log("Verification code created successfully:", verification);

    //create session

    const session = await SessionModel.create({
      userId: user._id,
      userAgent: data.userAgent,
    });

    //sign acces or refresh token logic can be added here

    const refreshToken = signToken(
      { sessionId: session._id },
      refreshTokenSignOptions
    );
    const accessToken = signToken({ userId: user._id, sessionId: session._id });

    // const refreshToken = jwt.sign(
    //   { sessionId: session._id },
    //   JWT_REFRESH_SECRET,
    //   {
    //     audience: ["user"],
    //     expiresIn: "30d",
    //   }
    // );

    // const accessToken = jwt.sign(
    //   { userId: user._id, sessionId: session._id },
    //   JWT_SECRET,
    //   { audience: ["user"], expiresIn: "15m" }
    // );

    return {
      user: {
        _id: user._id,
        email: user.email,
        verified: user.varified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      accessToken,
      refreshToken,
    };
  } catch (error) {
    if (error instanceof BadRequest) {
      throw error;
    }

    // 2. For all other cases (including InternalServerError if somehow thrown)
    throw new InternalServerError("Error while creating account");
  }
};

type loginUser = {
  email: string;
  password: string;
  userAgent?: string;
};

export const loginAccount = async (data: loginUser) => {
  try {
    const user = await UserModel.findOne({ email: data.email });
    if (!user) {
      throw new BadRequest("Invalid email or password");
    }

    const isPasswordValid = await user.comparePassword(data.password);
    if (!isPasswordValid) {
      throw new BadRequest("Invalid email or password");
    }

    const session = await SessionModel.create({
      userId: user._id,
      userAgent: data.userAgent,
    });
    const refreshToken = signToken(
      { sessionId: session._id },
      refreshTokenSignOptions
    );
    const accessToken = signToken({ userId: user._id, sessionId: session._id });
    return {
      user: {
        _id: user._id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      accessToken,
      refreshToken,
    };
  } catch (error) {
    if (error instanceof BadRequest) {
      throw error;
    }
    throw new InternalServerError("Error while logging in");
  }
};

export const logoutAccount = async (sessionId: string) => {
  try {
    const session = await SessionModel.findByIdAndDelete(sessionId);
    if (!session) {
      throw new BadRequest("Session not found");
    }

    return { message: "Logged out successfully" };
  } catch (error) {
    throw new InternalServerError("Error while logging out");
  }
};

export const refreshUserAccessToken = async (refreshToken: string) => {
  try {
    const { payload } = verifytoken<RefreshTokenPayload>(refreshToken, {
      secret: refreshTokenSignOptions.secret,
    });

    if (!payload || !payload.sessionId) {
      throw new BadRequest("Invalid refresh token");
    }

    const sessionId = payload.sessionId;
    // Check if the session exists
    const session = await SessionModel.findById(sessionId);
    if (!session) {
      throw new BadRequest("Session expires or does not exist");
    }

    const now = new Date();

    const sessionNeedsRefresh =
      session.expiresAt.getTime() - now.getTime() <= oneDayInMilliseconds;

    if (sessionNeedsRefresh) {
      session.expiresAt = thirthydayfromNow();
      await session.save();
    }

    const newRefreshToken = sessionNeedsRefresh
      ? signToken({ sessionId: session._id }, refreshTokenSignOptions)
      : undefined;

    const accessToken = signToken({
      userId: session.userId,
      sessionId: session._id,
    });
    return {
      accessToken,
      newRefreshToken,
    };
  } catch (error) {

    throw new InternalServerError("Error while refreshing access token");
    
  }
};
