import PwdUtil from "@src/util/PwdUtil";
import HttpStatusCodes from "@src/constants/HttpStatusCodes";
import { RouteError } from "@src/other/classes";
import { prisma } from "../db/client";
import { sign } from "jsonwebtoken";
import SessionUtil from "@src/util/SessionUtil";
import EnvVars from "@src/constants/EnvVars";

// Errors
export const Errors = {
  Unauth: "Unauthorized",
  EmailNotFound(email: string) {
    return `User with email '${email}' not found`;
  },
} as const;

// **** Functions **** //

const loginUser = async (email: string, password: string): Promise<string> => {
  // Get the user
  const user = await prisma.users.findFirst({
    where: {
      email: email,
    },
  });

  // Check if the user exists
  if (!user) {
    throw new RouteError(
      HttpStatusCodes.UNAUTHORIZED,
      Errors.EmailNotFound(email)
    );
  }

  // Check if the password is correct
  const isCorrect = await PwdUtil.compare(password, user.password);
  if (!isCorrect) {
    throw new RouteError(HttpStatusCodes.UNAUTHORIZED, Errors.Unauth);
  }

  if (!EnvVars.Jwt.Secret)
    throw new RouteError(
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      "jwt secret not set"
    );

  return await SessionUtil.setJWTUser({ uuid: user.uuid });
};

// **** Export default **** //

export default {
  loginUser,
} as const;
