/**
 * Express router paths go here.
 */

import { Immutable } from "@src/other/types";

const Paths = {
  Base: "/api",
  Users: {
    Base: "/users",
    Get: "/:uuid",
    Update: "/:uuid/update",
  },
  Auth: {
    Base: "/auth",
    Login: "/login",
    Register: "/register",
  },
};

// **** Export **** //

export type TPaths = Immutable<typeof Paths>;
export default Paths as TPaths;
