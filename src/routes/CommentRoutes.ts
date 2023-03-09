import { IReq, IRes } from "./types/express/misc";
import CommentService from "@src/services/CommentService";
import SessionUtil from "@src/util/SessionUtil";

// **** Types **** //

interface ICreateCommentReq {
    parent_uuid?: string,
    video_uuid: string,
    message: string,
}

interface IUpdateCommentReq {
    message: string,
}

// **** Functions **** //

const getComments = async (req: IReq, res: IRes) => {
    const { uuid } = req.params;

    const comments = await CommentService.getComments(uuid);

    return res.json(comments);
}

const createComment = async (req: IReq<ICreateCommentReq>, res: IRes) => {
    const { parent_uuid, video_uuid, message } = req.body;

    let jwtPayload = await SessionUtil.getJwtPayload(req);

    const comment = await CommentService.createComment(video_uuid, message, jwtPayload.uuid, parent_uuid);

    return res.json(comment);
}

const updateComment = async (req: IReq<IUpdateCommentReq>, res: IRes) => {
    const { uuid } = req.params;
    const { message } = req.body;

    let jwtPayload = await SessionUtil.getJwtPayload(req);

    const comment = await CommentService.updateComment(jwtPayload.uuid, uuid, message);

    return res.json(comment);
}

const deleteComment = async (req: IReq, res: IRes) => {
    const { uuid } = req.params;

    let jwtPayload = await SessionUtil.getJwtPayload(req);

    await CommentService.deleteComment(jwtPayload.uuid, uuid);

    return res.status(200).send({ message: "Comment deleted" });
}

export default {
    getComments,
    createComment,
    updateComment,
    deleteComment,
} as const;
