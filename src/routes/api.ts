import { Router } from "express";
import jetValidator from "jet-validator";
import { pathToRegexp } from "path-to-regexp";

import Paths from "./constants/Paths";
import AuthRoutes from "./AuthRoutes";
import UserRoutes from "./UserRoutes";
import VideoRoutes from "./VideoRoutes";
import { expressjwt } from "express-jwt";
import CommentRoutes from "./CommentRoutes";
import TagRoutes from "./TagRoutes";
import getFullPaths from "./constants/FullPaths";
import PlaylistRoutes from "./PlaylistRoutes";

// **** Routers **** //

const apiRouter = Router(),
  validate = jetValidator();

// ** Add UserRouter ** //
const userRouter = Router();

// Get user
userRouter.get(Paths.Users.Get, UserRoutes.getUser);

// Update user
userRouter.post(
  Paths.Users.Update,
  validate(
    ["name", (name) => name === undefined || typeof name === "string"],
    ["email", (email) => email === undefined || typeof email === "string"],
    [
      "password",
      (password) => password === undefined || typeof password === "string",
    ]
  ),
  UserRoutes.updateUser
);

// Excluded paths regex
const excludedUserPaths = [pathToRegexp(getFullPaths.Users.Get)];

// Add UserRouter
apiRouter.use(
  Paths.Users.Base,
  expressjwt({
    secret: process.env.JWT_SECRET ?? "",
    algorithms: ["HS256"],
  }).unless({ path: excludedUserPaths }),
  userRouter
);

// ** Add AuthRouter ** //
const authRouter = Router();

// Register
authRouter.post(
  Paths.Auth.Register,
  validate("email", "name", "password"),
  AuthRoutes.register
);

// Login
authRouter.post(
  Paths.Auth.Login,
  validate("email", "password"),
  AuthRoutes.login
);

apiRouter.use(Paths.Auth.Base, authRouter);

// ** Add VideoRouter ** //
const videoRouter = Router();

// Get all videos
videoRouter.get("", VideoRoutes.getVideos);

// Get video by id
videoRouter.get(
  Paths.Videos.Get,
  validate(["uuid", "string", "params"]),
  VideoRoutes.getVideoById
);

// Create video
videoRouter.post(
  Paths.Videos.Create,
  validate("title", "description", ["monetized", "boolean"], ["tag", "number"]),
  VideoRoutes.createVideo
);

// Update video
videoRouter.post(
  Paths.Videos.Update,
  validate(
    ["uuid", "string", "params"],
    "title",
    "description",
    ["monetized", "boolean"],
    ["tag", "number"]
  ),
  VideoRoutes.updateVideo
);

// Get comments by video UUID
videoRouter.get(
  Paths.Videos.Comments,
  validate(["uuid", "string", "params"]),
  VideoRoutes.getVideoComments
);

// Delete video
videoRouter.delete(
  Paths.Videos.Delete,
  validate(["uuid", "string", "params"]),
  VideoRoutes.deleteVideo
);

const excludedVideoPaths = [
  pathToRegexp(getFullPaths.Videos.Get),
  pathToRegexp(getFullPaths.Videos.Comments),
  pathToRegexp(getFullPaths.Videos.Base),
];

// Add VideoRouter
apiRouter.use(
  Paths.Videos.Base,
  expressjwt({
    secret: process.env.JWT_SECRET ?? "",
    algorithms: ["HS256"],
  }).unless({ path: excludedVideoPaths }),
  videoRouter
);

// Add CommentRouter
const commentRouter = Router();

// Create comment
commentRouter.post(
  Paths.Comments.Create,
  validate("video_uuid", "message"),
  CommentRoutes.createComment
);

// Update comment
commentRouter.post(
  Paths.Comments.Update,
  validate(["uuid", "string", "params"], "message"),
  CommentRoutes.updateComment
);

// Delete comment
commentRouter.delete(
  Paths.Comments.Delete,
  validate(["uuid", "string", "params"]),
  CommentRoutes.deleteComment
);

// Add CommentRouter
apiRouter.use(
  Paths.Comments.Base,
  expressjwt({ secret: process.env.JWT_SECRET ?? "", algorithms: ["HS256"] }),
  commentRouter
);

// ** Add PlaylistRouter ** //
const playlistRouter = Router();

// Get playlist by UUID
playlistRouter.get(
  Paths.Playlists.Get,
  validate(["uuid", "string", "params"]),
  PlaylistRoutes.getPlaylist
);

// Get playlists by user UUID
playlistRouter.get(
  Paths.Playlists.GetByUser,
  validate(["uuid", "string", "params"]),
  PlaylistRoutes.getUserPlaylists
);

// Create playlist
playlistRouter.post(
  Paths.Playlists.Create,
  validate("title", [
    "description",
    (description) =>
      typeof description === "string" || description === undefined,
  ]),
  PlaylistRoutes.createPlaylist
);

// Delete playlist
playlistRouter.delete(
  Paths.Playlists.Delete,
  validate(["uuid", "string", "params"]),
  PlaylistRoutes.deletePlaylist
);

// Add videos to playlist
playlistRouter.post(
  Paths.Playlists.Add,
  validate(
    ["uuid", "string", "params"],
    [
      "video_uuids",
      (video_uuids) =>
        Array.isArray(video_uuids) &&
        video_uuids.every((video_uuid) => typeof video_uuid === "string"),
    ],
    "playlist_uuid"
  ),
  PlaylistRoutes.addVideosToPlaylist
);

// Remove videos from playlist
playlistRouter.delete(
  Paths.Playlists.Remove,
  validate(
    ["uuid", "string", "params"],
    [
      "video_uuids",
      (video_uuids) =>
        Array.isArray(video_uuids) &&
        video_uuids.every((video_uuid) => typeof video_uuid === "string"),
    ],
    "playlist_uuid"
  ),
  PlaylistRoutes.removeVideosFromPlaylist
);

apiRouter.use(Paths.Playlists.Base, playlistRouter);

// ** Add TagRouter ** //
const tagRouter = Router();

// Get all tags
tagRouter.get("", TagRoutes.getTags);

// Add TagRouter
apiRouter.use(Paths.Tags.Base, tagRouter);

// **** Export default **** //
export default apiRouter;
