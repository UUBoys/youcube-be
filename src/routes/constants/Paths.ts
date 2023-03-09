/**
 * Express router paths go here.
 */

import { Immutable } from "@src/other/types";

const Paths = {
  Swagger: "/",
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
  Videos: {
    Base: "/videos",
    Get: "/:uuid",
    Create: "/create",
    Update: "/:uuid",
    Delete: "/:uuid/delete",
    Comments: "/:uuid/comments",
  },
  Comments: {
    Base: "/comment",
    Create: "/create",
    Update: "/:uuid/update",
    Delete: "/:uuid/delete",
  },
  Tags: {
    Base: "/tags",
  }
};

// **** Export **** //

export type TPaths = Immutable<typeof Paths>;
export default Paths as TPaths;
