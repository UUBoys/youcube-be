import HttpStatusCodes from "@src/constants/HttpStatusCodes";
import VideoService from "@src/services/VideoService";
import SessionUtil from "@src/util/SessionUtil";
import { RouteError } from "@src/other/classes";

import { IReq, IRes } from "./types/express/misc";

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

    if(!video) return res.status(HttpStatusCodes.NOT_FOUND).json({message: "Video not found"});

    return res.json(video);
}


const getVideos = async (req: IReq, res: IRes) => {
    const videos = await VideoService.getVideos();

    return res.json(videos);
}

const createVideo = async (req: IReq<ICreateVideoReq>, res: IRes) => {
    const { title, description, monetized, tag } = req.body;
    
    let jwtPayload;
    try {
        jwtPayload = await SessionUtil.getJwtPayload(req);
    } catch (e) {
        throw e;
    }

    const video = await VideoService.createVideo(title, description, monetized, tag, jwtPayload.uuid);

    return res.json(video);
}

const updateVideo = async (req: IReq<ICreateVideoReq>, res: IRes) => {
    const { uuid } = req.params;
    const { title, description, monetized, tag } = req.body;

    let jwtPayload;
    try {
        jwtPayload = await SessionUtil.getJwtPayload(req);
    } catch (e) {
        throw e;
    }

    const video = await VideoService.updateVideo(uuid, jwtPayload.uuid, title, description, monetized, tag) ?? null;
    if (!video) throw new RouteError(HttpStatusCodes.NOT_FOUND, "Video not found");

    return res.json(video)
}

const getVideoComments = async (req: IReq, res: IRes) => {
    const { uuid } = req.params;

    const comments = await VideoService.getVideoComments(uuid);

    return res.json(comments);
}

// **** Export default **** //

export default {
    getVideos,
    getVideoById,
    createVideo,
    updateVideo,
    getVideoComments,
} as const;