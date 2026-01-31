import { Response } from 'express';
import { getObject } from '../config/connection';
import { AuthenticatedRequest } from '../types';

export async function getUserDetails(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const result = await getObject(req.token!.email);
    const content = result.content as Record<string, unknown>;
    const data = {
      wallet: content.wallet,
      betAmount: content.betAmount,
      freeSpin: content.freeSpin,
      WinFreeSpinAmount: content.WinFreeSpinAmount,
      winInSpin: content.winInSpin,
      gamblecounter: content.gamblecounter,
      gambleWin: content.gambleWin,
      'gambleHistory ': content.gambleHistory,
    };
    res.ok({ message: 'USER_DETAILS', data });
  } catch {
    res.error('SOMETHING_WENT_WRONG');
  }
}
