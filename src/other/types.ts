export type Immutable<T> = {
  readonly [K in keyof T]: Immutable<T[K]>;
};

export type JWTToken = {
  uuid: string;

  iat?: number;
  exp?: number;
};

interface Video {
  uuid: string;
  user: User;
  title: string;
  monetized: boolean;
  description: string;
}

interface User {
  uuid: string;
  verified: boolean;
  name: string;
  email: string;
}

interface Comment {
  uuid: string;
  parent_uuid: string;
  user: User;
  message: string;
  created_at: string;
}

interface Tag {
  id: number;
  name: string;
}

interface PlayList {
  uuid: string;
  user: User;
  videos: Video[];
}
