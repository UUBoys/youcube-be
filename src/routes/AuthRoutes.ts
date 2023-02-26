import HttpStatusCodes from "@src/constants/HttpStatusCodes";
import AuthService from "@src/services/AuthService";
import UserService from "@src/services/UserService";

import { IReq, IRes } from "./types/express/misc";

// **** Types **** //

interface IRegisterReq {
  email: string;
  name: string;
  password: string;
}

interface ILoginReq {
  email: string;
  password: string;
}

// **** Functions **** //

const login = async (req: IReq<ILoginReq>, res: IRes) => {
  const { email, password } = req.body;

  const jwtToken = await AuthService.loginUser(email, password);

  if (!jwtToken) {
    return res.status(HttpStatusCodes.UNAUTHORIZED).json({
      message: "Wrong email or password",
    });
  }

  const user = await UserService.getUserByEmail(email);

  return res.json({
    user,
    jwt: jwtToken,
  });
};

const register = async (req: IReq<IRegisterReq>, res: IRes) => {
  const { email, password, name } = req.body;

  const userExists = await UserService.getUserByEmail(email);

  if (userExists) {
    res.status(409);
    return res.json({
      message: "User already exists",
    });
  }

  const newUser = await UserService.createUser(email, password, name);
  const jwtToken = await AuthService.loginUser(email, password);

  res.status(200);

  return res.json({
    user: newUser,
    jwt: jwtToken,
  });
};

// **** Export default **** //

export default {
  register,
  login,
} as const;
