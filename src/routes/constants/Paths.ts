/**
 * Express router paths go here.
 */

import { Immutable } from "@src/other/types";

const Paths = {
  Swagger: "/swagger",
  Base: "/api",
  Users: {
    Base: "/users",
    Get: "/:uuid",
    Update: "/update",
  },
  Auth: {
    Base: "/auth",
    Login: "/login",
    Register: "/register",
  },
  Videos: {
    Base: "/videos",
    Get: "/:uuid",
    GetByUser: "/user/:uuid",
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
  Playlists: {
    Base: "/playlists",
    Get: "/:uuid",
    Edit: "/:uuid",
    Delete: "/:uuid",
    Add: "/:uuid/add",
    Remove: "/:uuid/remove",
    GetByUser: "/user/:uuid",
    Create: "/create",
  },
  Tags: {
    Base: "/tags",
  },
};

// **** Export **** //

export type TPaths = Immutable<typeof Paths>;
export default Paths as TPaths;
