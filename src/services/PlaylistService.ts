import HttpStatusCodes from "@src/constants/HttpStatusCodes";
import { RouteError } from "@src/other/classes";
import { prisma } from "../db/client";
import { v4 } from "uuid";

// **** Classes **** //

class PlaylistVideosNotFound extends RouteError {
  missing_videos: string[];
  constructor(video_uuids: string[]) {
    super(HttpStatusCodes.NOT_FOUND, "One or more videos not found");
    this.missing_videos = video_uuids;
  }
}

// **** Functions **** //

const createPlaylist = async (
  user_uuid: string,
  title: string,
  description?: string
) => {
  const playlist = await prisma.playlist.create({
    data: {
      uuid: v4(),
      user_uuid: user_uuid,
      name: title,
      description: description,
    },
  });

  return playlist;
};

const getPlaylist = async (uuid: string) => {
  const playlist = await prisma.playlist.findFirst({
    where: {
      uuid: uuid,
    },
  });

  if (!playlist)
    throw new RouteError(HttpStatusCodes.NOT_FOUND, "Playlist not found");

  return playlist;
};

const getUserPlaylists = async (user_uuid: string) => {
  const playlists = await prisma.playlist.findMany({
    where: {
      user_uuid: user_uuid,
    },
  });

  if (playlists.length === 0)
    throw new RouteError(
      HttpStatusCodes.NOT_FOUND,
      "No playlists found for user"
    );

  return playlists;
};

const deletePlaylist = async (playlist_uuid: string, user_uuid: string) => {
  const deletedCount = await prisma.playlist
    .deleteMany({
      where: {
        uuid: playlist_uuid,
        user_uuid: user_uuid,
      },
    })
    .then((result) => result.count);

  if (deletedCount === 0)
    throw new RouteError(
      HttpStatusCodes.NOT_FOUND,
      "Playlist not found or not authorized to delete"
    );
};

const addVideosToPlaylist = async (
  video_uuids: string[],
  playlist_uuid: string,
  user_uuid: string
) => {
  const foundVideos = await prisma.videos
    .findMany({
      where: {
        uuid: {
          in: video_uuids,
        },
      },
      select: {
        uuid: true,
      },
    })
    .then((videos) => videos.map((video) => video.uuid));

  video_uuids = video_uuids.filter((video_uuid) => {
    return !foundVideos.includes(video_uuid);
  });

  if (video_uuids.length > 0) throw new PlaylistVideosNotFound(video_uuids);

  try {
    await prisma.playlist.findFirstOrThrow({
      where: {
        uuid: playlist_uuid,
        user_uuid: user_uuid,
      },
    });
  } catch {
    throw new RouteError(
      HttpStatusCodes.FORBIDDEN,
      "Playlist not found or not authorized to edit"
    );
  }

  await prisma.playlistVideos.createMany({
    data: video_uuids.map((video_uuid) => {
      return {
        playlist_uuid: playlist_uuid,
        video_uuid: video_uuid,
      };
    }),
  });

  return prisma.playlist.findFirst({
    where: {
      uuid: playlist_uuid,
    },
  });
};

const removeVideosFromPlaylist = async (
  video_uuids: string[],
  playlist_uuid: string,
  user_uuid: string
) => {
  try {
    await prisma.playlist.findFirstOrThrow({
      where: {
        uuid: playlist_uuid,
        user_uuid: user_uuid,
      },
    });
  } catch {
    throw new RouteError(
      HttpStatusCodes.NOT_FOUND,
      "Playlist not found or not authorized to edit"
    );
  }

  const deletedCount = await prisma.playlistVideos
    .deleteMany({
      where: {
        playlist_uuid: playlist_uuid,
        video_uuid: {
          in: video_uuids,
        },
      },
    })
    .then((result) => result.count);

  if (deletedCount === 0)
    throw new RouteError(
      HttpStatusCodes.NOT_FOUND,
      "No videos found to remove"
    );
};

export default {
  createPlaylist,
  getPlaylist,
  getUserPlaylists,
  deletePlaylist,
  addVideosToPlaylist,
  removeVideosFromPlaylist,
} as const;
