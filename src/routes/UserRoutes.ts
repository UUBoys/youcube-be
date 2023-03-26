import HttpStatusCodes from "@src/constants/HttpStatusCodes";
import { RouteError } from "@src/other/classes";
import UserService from "@src/services/UserService";
import SessionUtil from "@src/util/SessionUtil";
import { IReq, IRes } from "./types/express/misc";

// **** Types **** //

interface IUpdateUser {
  name?: string;
  email?: string;
  password?: string;
}

// **** Functions **** //

/**
 * Get user.
 */

const getUser = async (req: IReq, res: IRes) => {
  const { uuid } = req.params;

  const user = await UserService.getUser(uuid);

  return res.json(user);
};

const updateUser = async (req: IReq<IUpdateUser>, res: IRes) => {
  const { name, email, password } = req.body;

  if (!name && !email && !password) {
    throw new RouteError(HttpStatusCodes.BAD_REQUEST, "No data to update");
  }

  const jwtPayload = await SessionUtil.getJwtPayload(req);

  const user = await UserService.updateUser(jwtPayload.uuid, name, email, password);

  return res.json(user);
};

// **** Export default **** //

export default {
  getUser,
  updateUser,
} as const;
