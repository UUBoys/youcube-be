import { prisma } from "../db/client";
import PwdUtil from "@src/util/PwdUtil";
import { uuid } from "uuidv4";

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
    },
  });

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
      uuid: uuid(),
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

// **** Export default **** //

export default {
  createUser,
  getUser,
  getUserByEmail,
} as const;
