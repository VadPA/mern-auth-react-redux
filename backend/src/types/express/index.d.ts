import { IUser } from '../../types/userInterface';

export {};

declare global {
  namespace Express {
    export interface Request {
      user?: IUser;
      cleanBody?: any;
      role?: string;
    }
  }
}
