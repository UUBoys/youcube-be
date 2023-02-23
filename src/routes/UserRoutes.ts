import HttpStatusCodes from '@src/constants/HttpStatusCodes';

import UserService from '@src/services/UserService';
import { IReq, IRes } from './types/express/misc';


// **** Types **** //

interface IRegisterReq {
  email: string;
  name: string,
  password: string;
}




// **** Functions **** //

/**
 * Get user.
 */

const getUser = async(req: IReq, res: IRes) => {
  const {uuid} = req.params;

  const user = await UserService.getUser(uuid);

  return res.json({
    user,
  });
};



// **** Export default **** //

export default {
  getUser,
} as const;