import { Router } from 'express';
import jetValidator from 'jet-validator';

import adminMw from './middleware/adminMw';
import Paths from './constants/Paths';
import AuthRoutes from './AuthRoutes';

// **** Variables **** //

const apiRouter = Router(),
  validate = jetValidator();


// ** Add UserRouter ** //
const userRouter = Router();

// Get all users
userRouter.get(
  Paths.Users.Get,
);

// Add UserRouter
apiRouter.use(Paths.Users.Base, adminMw, userRouter);


const authRouter = Router();

// Register
authRouter.post(
  Paths.Auth.Register,
  AuthRoutes.register,
);

apiRouter.use(Paths.Auth.Base, adminMw, authRouter);

// **** Export default **** //
export default apiRouter;
