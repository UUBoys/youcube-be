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

  const jwtPayload = await SessionUtil.getJwtPayload(req);

  const user = await UserService.updateUser(
    jwtPayload.uuid,
    name,
    email,
    password
  );

  return res.json(user);
};

const deleteUser = async (req: IReq, res: IRes) => {
  const { uuid } = req.params;

  const jwtPayload = await SessionUtil.getJwtPayload(req);

  const query = await UserService.deleteUser(uuid);

  return res.json(query);
};
// **** Export default **** //

export default {
  getUser,
  updateUser,
  deleteUser,
} as const;
