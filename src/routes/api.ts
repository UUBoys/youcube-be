import { Router } from "express";
import jetValidator from "jet-validator";

import Paths from "./constants/Paths";
import AuthRoutes from "./AuthRoutes";
import UserRoutes from "./UserRoutes";
import { expressjwt } from "express-jwt";

// **** Variables **** //

const apiRouter = Router(),
  validate = jetValidator();

// ** Add UserRouter ** //
const userRouter = Router();

// Get all users
userRouter.get(Paths.Users.Get, UserRoutes.getUser);

// Add UserRouter
apiRouter.use(
  Paths.Users.Base,
  expressjwt({ secret: process.env.JWT_SECRET ?? "", algorithms: ["HS256"] }),
  userRouter
);

const authRouter = Router();

// Register
authRouter.post(Paths.Auth.Register, AuthRoutes.register);

// Login
authRouter.post(Paths.Auth.Login, AuthRoutes.login);

apiRouter.use(Paths.Auth.Base, authRouter);

// **** Export default **** //
export default apiRouter;
