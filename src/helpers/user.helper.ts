import Bcrypt from 'bcryptjs';
import { Request } from 'express';
import { UserContent } from '../types';

export class GameFunction {
  buildUserData(req: Request): UserContent {
    return {
      email: req.body.email,
      password: Bcrypt.hashSync(req.body.password, 10),
      wallet: 200000,
      betAmount: 100,
      freeSpin: 0,
      WinFreeSpinAmount: 0,
      totalfreeSpin: 0,
      wildMultipliar: 0,
      winInSpin: 0,
      gamblecounter: 0,
      gambleWin: 0,
      gambleHistory: [],
    };
  }
}

export const user = new GameFunction();
