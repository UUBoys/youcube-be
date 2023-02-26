import { Request, Response } from "express";

import HttpStatusCodes from "@src/constants/HttpStatusCodes";
import { RouteError } from "@src/other/classes";
import jsonwebtoken from "jsonwebtoken";

import EnvVars from "../constants/EnvVars";
import { JWTToken } from "@src/other/types";

// **** Variables **** //

// Errors
const Errors = {
  ParamFalsey: "Param is falsey",
  Validation: "JSON-web-token validation failed.",
} as const;

// Options
const Options = {
  expiresIn: EnvVars.Jwt.Exp,
};

// **** Functions **** //

/**
 * Get session data from request object (i.e. ISessionUser)
 */
function getSessionData<T>(req: Request): Promise<string | T | undefined> {
  const { Key } = EnvVars.CookieProps,
    jwt = req.signedCookies[Key];
  return _decode(jwt);
}

/**
 * Get JWT payload from request object - i.e. neodpustitelné kletby
 */
async function getJwtPayload(req: Request): Promise<JWTToken> {
  const jwt = req.headers.authorization?.split(" ")[1];

  if(!jwt) throw new RouteError(HttpStatusCodes.UNAUTHORIZED, Errors.Validation);
  
  const JWT = await _decode<JWTToken>(jwt) as JWTToken;
  if (!JWT || JWT instanceof String) throw new RouteError(HttpStatusCodes.UNAUTHORIZED, Errors.Validation);

  return JWT as JWTToken;
}

function setJWTUser(payload: JWTToken) {
  return _sign(payload);
}

/**
 * Add a JWT to the response
 */
async function addSessionData(
  res: Response,
  data: string | object
): Promise<Response> {
  if (!res || !data) {
    throw new RouteError(HttpStatusCodes.BAD_REQUEST, Errors.ParamFalsey);
  }
  // Setup JWT
  const jwt = await _sign(data),
    { Key, Options } = EnvVars.CookieProps;
  // Return
  return res.cookie(Key, jwt, Options);
}

/**
 * Remove cookie
 */
function clearCookie(res: Response): Response {
  const { Key, Options } = EnvVars.CookieProps;
  return res.clearCookie(Key, Options);
}

// **** Helper Functions **** //

/**
 * Encrypt data and return jwt.
 */
function _sign(data: string | object | Buffer): Promise<string> {
  return new Promise((res, rej) => {
    jsonwebtoken.sign(data, EnvVars.Jwt.Secret, Options, (err, token) => {
      return err ? rej(err) : res(token || "");
    });
  });
}

/**
 * Decrypt JWT and extract client data.
 */
function _decode<T>(jwt: string): Promise<string | undefined | T> {
  return new Promise((res, rej) => {
    jsonwebtoken.verify(jwt, EnvVars.Jwt.Secret, (err, decoded) => {
      return err ? rej(Errors.Validation) : res(decoded as T);
    });
  });
}

// **** Export default **** //

export default {
  getJwtPayload,
  addSessionData,
  getSessionData,
  clearCookie,
  setJWTUser,
} as const;
