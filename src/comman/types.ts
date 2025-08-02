export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export type GuardRequest = Request & {
  user: Payload;
  headers: CustomHeaders;
};

export type Payload = {
  id: number;
  role: UserRole;
};


type CustomHeaders = Headers & {
  authorization?: string;
};

export type Tokens = {
  accessToken: string;
  refreshToken: string;
}

export type PaginatedResponse<T> = {
  data: T[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    pageCount: number;
  };
};
