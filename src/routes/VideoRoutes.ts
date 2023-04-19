import HttpStatusCodes from "@src/constants/HttpStatusCodes";
import VideoService from "@src/services/VideoService";
import SessionUtil from "@src/util/SessionUtil";
import { RouteError } from "@src/other/classes";

import { IReq, IRes } from "./types/express/misc";
import CommentService from "@src/services/CommentService";
import { expressjwt } from "express-jwt";

// **** Types **** //
interface ICreateVideoReq {
  title: string;
  description: string;
  monetized: boolean;
  url: string;
  tag: number;
}

interface IUpdateVideoReq {
  title?: string;
  description?: string;
  monetized?: boolean;
  url?: string;
  tag?: number;
}

// **** Functions **** //
const getVideoById = async (req: IReq, res: IRes) => {
  const { uuid } = req.params;
  let jwtPayload = null;

  try {
    jwtPayload = await SessionUtil.getJwtPayload(req);
  } catch (_) {}


  const video = await VideoService.getVideo(uuid, jwtPayload?.uuid);

  if (!video)
    throw new RouteError(HttpStatusCodes.NOT_FOUND, "Video not found");

  return res.json(video);
};

const getVideos = async (req: IReq, res: IRes) => {
  const videos = await VideoService.getVideos();

  return res.json(videos);
};

const getVideosByUserUUID = async (req: IReq, res: IRes) => {
  const { uuid } = req.params;

  const videos = await VideoService.getVideosByUserUUID(uuid);

  return res.json(videos);
};

const createVideo = async (req: IReq<ICreateVideoReq>, res: IRes) => {
  const { title, description, monetized, tag, url } = req.body;

  let jwtPayload = await SessionUtil.getJwtPayload(req);

  const video = await VideoService.createVideo(
    title,
    description,
    url,
    monetized,
    tag,
    jwtPayload.uuid
  );

  return res.json(video);
};

const updateVideo = async (req: IReq<IUpdateVideoReq>, res: IRes) => {
  const { uuid } = req.params;
  const { title, description, monetized, tag, url } = req.body;

  if (!title && !description && !monetized && !tag)
    throw new RouteError(HttpStatusCodes.BAD_REQUEST, "No data to update");

  let jwtPayload = await SessionUtil.getJwtPayload(req);

  const video = await VideoService.updateVideo(
    uuid,
    jwtPayload.uuid,
    title,
    description,
    monetized,
    tag,
    url
  );

  return res.json(video);
};

const deleteVideo = async (req: IReq, res: IRes) => {
  const { uuid } = req.params;

  let jwtPayload = await SessionUtil.getJwtPayload(req);

  await VideoService.deleteVideo(uuid, jwtPayload.uuid);

  return res.status(200).send({ message: "Video deleted" });
};

const getVideoComments = async (req: IReq, res: IRes) => {
  const { uuid } = req.params;

  const comments = await CommentService.getComments(uuid);

  return res.json(comments);
};

const likeVideo = async (req: IReq, res: IRes) => {
  const { uuid } = req.params;

  let jwtPayload = await SessionUtil.getJwtPayload(req);

  let like = await VideoService.likeSwitchVideo(uuid, jwtPayload.uuid);

  return res.status(200).send({ 
    message: like ? "Video liked" : "Video unliked",
    like: like
  });
};

const likedVideos = async (req: IReq, res: IRes) => {
  let jwtPayload = await SessionUtil.getJwtPayload(req);

  const videos = await VideoService.getLikedVideos(jwtPayload.uuid);

  return res.json(videos);
};

// **** Export default **** //

export default {
  getVideos,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo,
  likeVideo,
  likedVideos,
  getVideoComments,
  getVideosByUserUUID,
} as const;
