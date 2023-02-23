// **** Variables **** //

const INVALID_CONSTRUCTOR_PARAM = 'nameOrObj arg must a string or an object ' + 
  'with the appropriate user keys.';

// **** Types **** //

export interface IUser {
  uuid: string;
  name: string;
  email: string;
  password: string;
}


// **** User **** //

class User implements IUser {

  public uuid: string;
  public name: string;
  public email: string;
  public password: string;

  /**
   * Constructor()
   */
  public constructor(
    uuid: string,
    name: string,
    email: string,
    password: string, // id last cause usually set by db
  ) {
    this.name = name;
    this.email = email;
    this.uuid = uuid;
    this.password = password;
  }

  
  /**
   * Is this an object which contains all the user keys.
   */
  public static isUser(this: void, arg: unknown): boolean {
    return (
      !!arg &&
      typeof arg === 'object' &&
      'id' in arg &&
      'email' in arg &&
      'name' in arg &&
      'role' in arg
    );
  }
}


// **** Export default **** //

export default User;
