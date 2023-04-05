import { IReq, IRes } from "./types/express/misc";
import PlaylistService from "@src/services/PlaylistService";
import SessionUtil from "@src/util/SessionUtil";

interface ICreatePlaylist {
  title: string;
  description?: string;
}

interface IUpdatePlaylist {
  title?: string;
  description?: string;
}

interface IAddRemoveVideos {
  video_uuids: string[];
  playlist_uuid: string;
}

const getPlaylist = async (req: IReq, res: IRes) => {
  const { playlist_uuid } = req.params;

  const playlist = await PlaylistService.getPlaylist(playlist_uuid);

  return res.json(playlist);
};

const getUserPlaylists = async (req: IReq, res: IRes) => {
  const { uuid } = req.params;

  const playlist = await PlaylistService.getUserPlaylists(uuid);

  return res.json(playlist);
};

const createPlaylist = async (req: IReq<ICreatePlaylist>, res: IRes) => {
  const { title, description } = req.body;

  const jwt = await SessionUtil.getJwtPayload(req);

  const playlist = await PlaylistService.createPlaylist(
    jwt.uuid,
    title,
    description
  );

  return res.json(playlist);
};

const editPlaylist = async (req: IReq<IUpdatePlaylist>, res: IRes) => {
  const { title, description } = req.body;
  const { uuid } = req.params;

  const jwt = await SessionUtil.getJwtPayload(req);

  const playlist = await PlaylistService.editPlaylist(
    uuid,
    jwt.uuid,
    title,
    description
  );

  return res.json(playlist);
};

const deletePlaylist = async (req: IReq, res: IRes) => {
  const { uuid } = req.params;

  const jwt = await SessionUtil.getJwtPayload(req);

  await PlaylistService.deletePlaylist(jwt.uuid, uuid);

  return res.status(200).send({ message: "Playlist deleted" });
};

const addVideosToPlaylist = async (req: IReq<IAddRemoveVideos>, res: IRes) => {
  const { video_uuids } = req.body;
  const { playlist_uuid } = req.params;

  const jwt = await SessionUtil.getJwtPayload(req);

  const playlistUpdated = await PlaylistService.addVideosToPlaylist(
    video_uuids,
    playlist_uuid,
    jwt.uuid
  );

  return res.json(playlistUpdated);
};

const removeVideosFromPlaylist = async (
  req: IReq<IAddRemoveVideos>,
  res: IRes
) => {
  const { video_uuids } = req.body;
  const { playlist_uuid } = req.params;

  const jwt = await SessionUtil.getJwtPayload(req);

  const playlistUpdated = await PlaylistService.removeVideosFromPlaylist(
    video_uuids,
    playlist_uuid,
    jwt.uuid
  );

  return res.json(playlistUpdated);
};

export default {
  getPlaylist,
  getUserPlaylists,
  createPlaylist,
  editPlaylist,
  deletePlaylist,
  addVideosToPlaylist,
  removeVideosFromPlaylist,
} as const;
