import HttpStatusCodes from "@src/constants/HttpStatusCodes";
import VideoService from "@src/services/VideoService";
import SessionUtil from "@src/util/SessionUtil";
import { RouteError } from "@src/other/classes";

import { IReq, IRes } from "./types/express/misc";
import CommentService from "@src/services/CommentService";

// **** Types **** //
interface ICreateVideoReq {
    title: string;
    description: string;
    monetized: boolean;
    tag: number;
}

// **** Functions **** //
const getVideoById = async (req: IReq, res: IRes) => {
    const { uuid } = req.params;
    const video = await VideoService.getVideo(uuid);

    if (!video) return res.status(HttpStatusCodes.NOT_FOUND).json({ message: "Video not found" });

    return res.json(video);
}


const getVideos = async (req: IReq, res: IRes) => {
    const videos = await VideoService.getVideos();

    return res.json(videos);
}

const createVideo = async (req: IReq<ICreateVideoReq>, res: IRes) => {
    const { title, description, monetized, tag } = req.body;

    let jwtPayload = await SessionUtil.getJwtPayload(req);

    const video = await VideoService.createVideo(title, description, monetized, tag, jwtPayload.uuid);

    return res.json(video);
}

const updateVideo = async (req: IReq<ICreateVideoReq>, res: IRes) => {
    const { uuid } = req.params;
    const { title, description, monetized, tag } = req.body;

    let jwtPayload = await SessionUtil.getJwtPayload(req);

    const video = await VideoService.updateVideo(uuid, jwtPayload.uuid, title, description, monetized, tag);

    return res.json(video)
}

const deleteVideo = async (req: IReq, res: IRes) => {
    const { uuid } = req.params;

    let jwtPayload = await SessionUtil.getJwtPayload(req);

    await VideoService.deleteVideo(uuid, jwtPayload.uuid);

    return res.status(200).send({ message: "Video deleted" });
}

const getVideoComments = async (req: IReq, res: IRes) => {
    const { uuid } = req.params;

    const comments = await CommentService.getComments(uuid);

    return res.json(comments);
}

// **** Export default **** //

export default {
    getVideos,
    getVideoById,
    createVideo,
    updateVideo,
    deleteVideo,
    getVideoComments,
} as const;