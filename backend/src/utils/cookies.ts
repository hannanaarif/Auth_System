import { CookieOptions, Request, Response } from "express";
import { fifteenMinutesfromNow, thirthydayfromNow } from "./date";

const secure = process.env.NODE_ENV !== "development";

const defaults: CookieOptions = {
  httpOnly: true,
  secure,
  sameSite: "strict",
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
  path: '/auth/refresh',
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

export const clearAuthCookies = (res: Response) => {
  return res.clearCookie("accessToken").clearCookie("refreshToken",{
    path: '/auth/refresh',
  });
};


