import HttpStatusCodes from "@src/constants/HttpStatusCodes";
import { RouteError } from "@src/other/classes";
import { prisma } from "../db/client";
import { v4 } from "uuid";

// **** Functions **** //

const getVideos = async () => {
    const videos = await prisma.videos.findMany({
        select: {
            uuid: true,
            title: true,
            descripion: true,
            monetized: true,
            created: true,
            tag: true,
            users: {
                select: {
                    uuid: true,
                    name: true
                }
            }
        },
    });

    return videos;
};

const getVideo = async (uuid: string) => {
    const video = await prisma.videos.findFirst({
        where: {
            uuid: uuid
        },
        select: {
            uuid: true,
            title: true,
            descripion: true,
            monetized: true,
            created: true,
            tags: {
                select: {
                    name: true
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

    return video;
};

const createVideo = async (title: string, description: string, monetized: boolean, tag: number, userUuid: string) => {
    const video = await prisma.videos.create({
        data: {
            uuid: v4(),
            created: new Date(),
            title: title,
            descripion: description,
            monetized: monetized,
            tag: tag,
            user_uuid: userUuid,
        },
        select: {
            uuid: true,
            title: true,
            descripion: true,
            monetized: true,
            created: true,
            user_uuid: true,
            tags: {
                select: {
                    name: true
                }
            },
        }
    });

    return video;
};

const updateVideo = async (video_uuid: string, user_uuid: string, title: string, description: string, monetized: boolean, tag: number) => {
    const editQuery = await prisma.videos.updateMany({
        where: {
            user_uuid: user_uuid,
            uuid: video_uuid,
        },
        data: {
            title: title,
            descripion: description,
            monetized: monetized,
            tag: tag,
        },
    });

    if (editQuery.count === 0) throw new RouteError(HttpStatusCodes.NOT_FOUND, "Video not found or not authorized to edit this video");

    const video = await prisma.videos.findFirst({
        where: {
            uuid: video_uuid,
        },
    });

    return video;
};

const deleteVideo = async (video_uuid: string, user_uuid: string) => {
    const deleteQuery = await prisma.videos.deleteMany({
        where: {
            uuid: video_uuid,
            user_uuid: user_uuid,
        },
    });

    if (deleteQuery.count === 0) throw new RouteError(HttpStatusCodes.NOT_FOUND, "Video not found or not authorized to delete this video");

    return deleteQuery;
};

// **** Export default **** //

export default {
    getVideos,
    getVideo,
    createVideo,
    updateVideo,
    deleteVideo,
} as const;
