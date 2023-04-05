import { prisma } from "../db/client";
import PwdUtil from "@src/util/PwdUtil";
import { v4 } from "uuid";
import { RouteError } from "@src/other/classes";
import HttpStatusCodes from "@src/constants/HttpStatusCodes";

// **** Variables **** //
export const USER_NOT_FOUND_ERR = "User not found";

// **** Functions **** //

const getUser = async (uuid: string) => {
  const user = await prisma.users.findUnique({
    where: {
      uuid: uuid,
    },
    select: {
      uuid: true,
      name: true,
      email: true,
      videos: true,
      playlist: true
    },
  });

  if (!user) throw new RouteError(HttpStatusCodes.NOT_FOUND, USER_NOT_FOUND_ERR)

  return user;
};

const getUserByEmail = async (email: string) => {
  const user = await prisma.users.findFirst({
    where: {
      email: email,
    },
    select: {
      uuid: true,
      name: true,
      email: true,
    },
  });

  return user;
};

const createUser = async (email: string, password: string, name: string) => {
  // Salt and hash the password
  const hashedPassword = await PwdUtil.getHash(password);

  // Create the user
  const newUser = await prisma.users.create({
    data: {
      uuid: v4(),
      name: name,
      email: email,
      password: hashedPassword,
    },
    select: {
      uuid: true,
      name: true,
      email: true,
    },
  });

  return newUser;
};

const updateUser = async (uuid: string, name?: string, email?: string, password?: string) => {
  // Salt and hash the password
  const hashedPassword = password ? await PwdUtil.getHash(password) : undefined;

  // Update the user
  const updatedUser = await prisma.users.update({
    where: {
      uuid: uuid,
    },
    data: {
      name: name,
      email: email,
      password: hashedPassword,
    },
    select: {
      uuid: true,
      name: true,
      email: true,
    },
  });

  if (!updatedUser) throw new RouteError(HttpStatusCodes.NOT_FOUND, USER_NOT_FOUND_ERR);

  return updatedUser;
};
// **** Export default **** //

export default {
  createUser,
  getUser,
  getUserByEmail,
  updateUser,
} as const;
