import { SignOptions } from "jsonwebtoken";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env";
import { UserDocument } from "../models/user_model";
import jwt from "jsonwebtoken";
import { SessionDocument } from "../models/session_model";
import BadRequest from "../errors/BadRequest";

enum Audience {
  User = "user",
}
export type AccessTokenPayload = {
  userId: UserDocument["_id"];
  sessionId: SessionDocument["_id"];
};

export type RefreshTokenPayload = {
  sessionId: SessionDocument["_id"];
};

type SignOptionsAndSecret = SignOptions & {
  secret: string;
};

const accessTokenSignOptions: SignOptionsAndSecret = {
  secret: JWT_SECRET,
  expiresIn: "30d",
};

export const refreshTokenSignOptions: SignOptionsAndSecret = {
  secret: JWT_REFRESH_SECRET,
  expiresIn: "15m",
};

const defaults: SignOptions = {
  audience: [Audience.User],
};

export const signToken = (
  payload: AccessTokenPayload | RefreshTokenPayload,
  option?: SignOptionsAndSecret
): string => {
  const { secret, ...signOpts } = option || accessTokenSignOptions;

  return jwt.sign(payload, secret, {
    ...defaults,
    ...signOpts,
  });
};

export const verifytoken =<Tpayload extends object = AccessTokenPayload> (token: string, option?: SignOptionsAndSecret) => {
  const { secret = JWT_SECRET, ...verifyOpts } = option || {};
  try {
     const payload= jwt.verify(token, secret, { ...defaults, ...verifyOpts }) as Tpayload;

     return {
        payload
     }
     
  } catch (error) {
    throw new BadRequest("Token verification failed");
  }
};
