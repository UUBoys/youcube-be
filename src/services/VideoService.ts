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
      description: true,
      url: true,
      monetized: true,
      created: true,
      tag: true,
      users: {
        select: {
          uuid: true,
          name: true,
        },
      },
      _count: {
        select: {
          liked_videos: true,
          videoView: true,
        },
      },
    },
    orderBy: {
      created: "desc",
    },
  });

  return videos;
};

const getVideosByUserUUID = async (uuid: string) => {
  const videos = await prisma.videos.findMany({
    where: {
      user_uuid: uuid,
    },
    select: {
      uuid: true,
      title: true,
      description: true,
      url: true,
      monetized: true,
      created: true,
      tag: true,
      users: {
        select: {
          uuid: true,
          name: true,
        },
      },
      _count: {
        select: {
          liked_videos: true,
          videoView: true,
        },
      },
    },
  });

  return videos;
};

const getVideo = async (uuid: string, userUUID?: string) => {
  const video = await prisma.videos.findFirst({
    where: {
      uuid: uuid,
    },
    select: {
      uuid: true,
      title: true,
      description: true,
      url: true,
      monetized: true,
      created: true,
      users: {
        select: {
          uuid: true,
          name: true,
        },
      },
      comments: {
        select: {
          uuid: true,
          created: true,
          message: true,
          parent_uuid: true,
          users: {
            select: {
              uuid: true,
              name: true,
            },
          },
        },
      },
      _count: {
        select: {
          liked_videos: true,
          videoView: true,
        },
      },
    },
  });

  if (video) {
    if (userUUID) {
      const videoView = await prisma.videoView.findFirst({
        where: {
          video_uuid: uuid,
          user_uuid: userUUID,
        },
      });

      if (!videoView) {
        await prisma.videoView.create({
          data: {
            uuid: v4(),
            created: new Date(),
            video_uuid: uuid,
            user_uuid: userUUID,
          },
        });
      }
    }
  }

  const isLikedByUser = await prisma.likedVideos.findFirst({
    where: {
      user_uuid: userUUID,
      video_uuid: video?.uuid,
    },
  });

  return { video, isLikedByUser: isLikedByUser ? true : false };
};

const createVideo = async (
  title: string,
  description: string,
  url: string,
  monetized: boolean,
  tag: number,
  userUuid: string
) => {
  const video = await prisma.videos.create({
    data: {
      uuid: v4(),
      created: new Date(),
      title: title,
      description: description,
      monetized: monetized,
      url: url,
      tag: tag,
      user_uuid: userUuid,
    },
  });

  return video;
};

const updateVideo = async (
  video_uuid: string,
  user_uuid: string,
  title?: string,
  description?: string,
  monetized?: boolean,
  tag?: number,
  url?: string
) => {
  const editQuery = await prisma.videos.updateMany({
    where: {
      user_uuid: user_uuid,
      uuid: video_uuid,
    },
    data: {
      title: title,
      description: description,
      monetized: monetized,
      tag: tag,
      url: url,
    },
  });

  if (editQuery.count === 0)
    throw new RouteError(
      HttpStatusCodes.NOT_FOUND,
      "Video not found or not authorized to edit this video"
    );

  const video = await prisma.videos.findFirst({
    where: {
      uuid: video_uuid,
    },
  });

  return video;
};

const deleteVideo = async (video_uuid: string, user_uuid: string) => {
  const video = await prisma.videos.findFirst({
    where: {
      uuid: video_uuid,
    },
  });

  if (!video || video.user_uuid !== user_uuid)
    throw new RouteError(
      HttpStatusCodes.NOT_FOUND,
      "Video not found or not authorized to delete this video"
    );

  const deleteQuery = await prisma.videos.delete({
    where: {
      uuid: video_uuid,
    },
    include: {
      comments: true,
      videoView: true,
      liked_videos: true,
    },
  });

  return deleteQuery;
};

const likeSwitchVideo = async (video_uuid: string, user_uuid: string) => {
  const video = await prisma.videos.findFirst({
    where: {
      uuid: video_uuid,
    },
  });

  if (!video)
    throw new RouteError(HttpStatusCodes.NOT_FOUND, "Video not found");

  const likeExists = await prisma.likedVideos.findFirst({
    where: {
      video_uuid: video_uuid,
      user_uuid: user_uuid,
    },
  });

  if (!likeExists) {
    await prisma.likedVideos.create({
      data: {
        user_uuid: user_uuid,
        video_uuid: video_uuid,
      },
    });
    return true;
  } else {
    await prisma.likedVideos.delete({
      where: {
        id: likeExists.id,
      },
    });
    return false;
  }
};

const getLikedVideos = async (user_uuid: string) => {
  const likedVideos = await prisma.likedVideos.findMany({
    where: {
      user_uuid: user_uuid,
    },
    select: {
      video_uuid: true,
    },
  });

  return likedVideos;
};

// **** Export default **** //

export default {
  getVideos,
  getVideo,
  getVideosByUserUUID,
  createVideo,
  updateVideo,
  deleteVideo,
  likeSwitchVideo,
  getLikedVideos,
} as const;
