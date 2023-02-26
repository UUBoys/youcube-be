export type Immutable<T> = {
  readonly [K in keyof T]: Immutable<T[K]>;
};

export type JWTToken = {
  uuid: string;
  
  iat?: number;
  exp?: number;
}