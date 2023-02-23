/**
 * Middleware to verify user logged in and is an an admin.
 */

import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';

import HttpStatusCodes from '@src/constants/HttpStatusCodes';

import SessionUtil from '@src/util/SessionUtil';


// **** Variables **** //

const USER_UNAUTHORIZED_ERR = 'User not authorized to perform this action';


// **** Types **** //


// **** Functions **** //

/**
 * See note at beginning of file.
 */
function adminMw(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  return next();
}


// **** Export Default **** //

export default adminMw;
