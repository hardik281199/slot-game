import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      validatedParams?: unknown;
    }
  }
}

export interface ExtendedResponsePayload {
  message?: string;
  data?: unknown;
  statusCode?: number;
}

declare global {
  namespace Express {
    interface Response {
      ok: (payload?: ExtendedResponsePayload | string) => void;
      error: (messageOrPayload: string | ExtendedResponsePayload, data?: unknown) => void;
      unauthorized: (message?: string) => void;
      notFound: (message?: string) => void;
      validationError: (payload: { message?: string; data?: unknown }) => void;
    }
  }
}

export interface JwtPayload {
  email: string;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest extends Request {
  token?: JwtPayload;
}

export interface CouchbaseDoc<T = unknown> {
  content: T;
  value?: T;
}

export interface ViewZone {
  rows: number;
  columns: number;
}

export interface PayObject {
  '3ofakind': number;
  '4ofakind': number;
  '5ofakind': number;
}

export interface PayTable {
  H1: PayObject;
  H2: PayObject;
  H3: PayObject;
  A: PayObject;
  K: PayObject;
  J: PayObject;
  SCATTER: PayObject;
}

export interface GameConfigContent {
  gameName: string;
  viewZone: ViewZone;
  payarray: number[][];
  payTable: PayTable;
  arrayOfReel: string[][];
  maxWinAmount: number;
  docType?: string;
  createdAt?: number;
  updateAt?: number;
  deletedAt?: number;
}

export interface UserContent {
  email: string;
  password?: string;
  wallet: number;
  betAmount: number;
  freeSpin: number;
  WinFreeSpinAmount: number;
  totalfreeSpin: number;
  wildMultipliar: number;
  winInSpin: number;
  gamblecounter: number;
  gambleWin: number;
  gamble_history?: string[];
  gambleHistory?: string[];
  jwt?: string;
}
