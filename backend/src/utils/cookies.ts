import { CookieOptions, Request, Response } from "express";
import { fifteenMinutesfromNow, thirthydayfromNow } from "./date";

const isProduction = process.env.NODE_ENV === "production";

const defaults: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "strict" : "lax",
  domain: 'localhost',
  path: '/'
};

const getAccessTokenCookieOptions = () => ({
  ...defaults,
  expires: fifteenMinutesfromNow(),
});

const getRefreshTokenCookieOptions = () => ({
  ...defaults,
  expires: thirthydayfromNow(),
  path: '/auth',
  sameSite: 'lax' as const,
  secure: false, // For local development
  httpOnly: true
});

type params = {
  res: Response;
  accessToken: string;
  refreshToken: string;
};

export const setAuthCookies = ({
  res,
  accessToken,
  refreshToken,
}: params) => {
  return res
    .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
    .cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions())
};
