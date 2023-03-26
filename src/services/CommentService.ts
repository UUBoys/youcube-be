import { prisma } from "../db/client";
import HttpStatusCodes from "@src/constants/HttpStatusCodes";
import { RouteError } from "@src/other/classes";
import { v4 } from "uuid";

// **** Functions **** //

const getComments = async (video_uuid: string) => {
    const comments = await prisma.comments.findMany({
        where: {
            video_uuid: video_uuid,
            parent_uuid: null, // Only get top level comments
        },
        select: {
            uuid: true,
            video_uuid: true,
            message: true,
            created: true,
            other_comments: {
                select: {
                    uuid: true,
                    video_uuid: true,
                    message: true,
                    created: true,
                    users: {
                        select: {
                            uuid: true,
                            name: true
                        }
                    }
                }
            },
            users: {
                select: {
                    uuid: true,
                    name: true
                }
            }
        },
    });

    return comments;
}

const createComment = async (video_uuid: string, message: string, user_uuid: string, parent_comment?: string) => {
    const video = await prisma.videos.findUnique({
        where: {
            uuid: video_uuid
        }
    });

    if(!video) throw new RouteError(HttpStatusCodes.NOT_FOUND, "Video not found");
    
    const comment = await prisma.comments.create({
        data: {
            uuid: v4(),
            message: message,
            users: {
                connect: {
                    uuid: user_uuid
                }
            },
            videos: {
                connect: {
                    uuid: video_uuid
                }
            },
            ...(parent_comment) && {
                comments: {
                    connect: {
                        uuid: parent_comment
                    }
                }
            }
        }
    });

    return comment;
}

const updateComment = async (user_uuid: string, uuid: string, message: string) => {
    const updateQuery = await prisma.comments.updateMany({
        where: {
            uuid: uuid,
            user_uuid: user_uuid
        },
        data: {
            message: message,
            created: new Date()
        },
    });

    if (updateQuery.count === 0) throw new RouteError(HttpStatusCodes.NOT_FOUND, "Comment not found or you do not have permission to edit this comment");

    const comment = await prisma.comments.findUnique({
        where: {
            uuid: uuid
        },
        select: {
            uuid: true,
            video_uuid: true,
            message: true,
        }
    });

    return comment;
}

const deleteComment = async (user_uuid: string, uuid: string) => {
    const comment = await prisma.comments.deleteMany({
        where: {
            uuid: uuid,
            user_uuid: user_uuid
        }
    });

    if (comment.count === 0) throw new RouteError(HttpStatusCodes.NOT_FOUND, "Comment not found or you do not have permission to delete this comment");

    return comment;
}

export default {
    getComments,
    createComment,
    updateComment,
    deleteComment
} as const;