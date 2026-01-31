import { Response } from 'express';
import { getObject, upsertObject } from '../config/connection';
import { gameHelper } from '../helpers/game.helper';
import { AuthenticatedRequest } from '../types';

export class SlotGame {
  gameFunction = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const reslt = await getObject(req.token!.email);
      const content = reslt.content as Record<string, unknown>;
      if (!content.jwt) {
        res.unauthorized('FAILED_AUTHENTICATION');
        return;
      }
      let wallet = content.wallet as number;
      let betAmount = content.betAmount as number;
      let freeSpin = content.freeSpin as number;
      let WinFreeSpinAmount = content.WinFreeSpinAmount as number;
      let totalfreeSpin = content.totalfreeSpin as number;
      let winInSpin = content.winInSpin as number;
      let wildMultipliar = content.wildMultipliar as number;
      if (winInSpin !== 0) {
        res.error('GAMBLE_ERROR');
        return;
      }
      const gameVariable = await getObject('MyJackpot');
      const gv = gameVariable.content as Record<string, unknown>;
      const generateViewZone = gameHelper.generateViewZone(gv as Parameters<typeof gameHelper.generateViewZone>[0]);
      const viewZone = generateViewZone.viewZone;
      const wildMult = (gv.wildMult as number[]) ?? [1];
      const expanding_Wild = gameHelper.expandingWildCard(generateViewZone, wildMult);
      wildMultipliar = expanding_Wild.wildMultipliar;
      const matrixReelXCol = gameHelper.matrix(
        expanding_Wild,
        (gv.viewZone as { rows: number }).rows,
        (gv.viewZone as { columns: number }).columns
      );
      const checkPayline = gameHelper.checkPayline(
        gv.payarray as number[][],
        matrixReelXCol,
        content,
        gv.payTable as Record<string, Record<string, number>>,
        expanding_Wild.checkDevil
      );
      WinFreeSpinAmount = checkPayline.WinFreeSpinAmount;
      wallet = checkPayline.wallet;
      winInSpin = checkPayline.winAmount;
      let checkfreeSpin = checkPayline.freeSpin;
      if (freeSpin !== 0) {
        freeSpin--;
        checkfreeSpin--;
      } else {
        wallet = gameHelper.debitWinAmount(checkPayline.wallet, content.betAmount as number);
        WinFreeSpinAmount = 0;
      }
      if (checkPayline.sactterCount > 2) {
        const countOfFreeSpin = gameHelper.countOfFreeSpin(freeSpin, totalfreeSpin);
        freeSpin = countOfFreeSpin.freeSpin;
        totalfreeSpin = countOfFreeSpin.totalfreeSpin;
      }
      const responceFreeSpin =
        freeSpin === 0
          ? gameHelper.freeSpin(checkfreeSpin, checkPayline.WinFreeSpinAmount, totalfreeSpin)
          : gameHelper.freeSpin(freeSpin, checkPayline.WinFreeSpinAmount, totalfreeSpin);
      const result = checkPayline.result;
      content.wallet = wallet;
      content.betAmount = betAmount;
      content.freeSpin = freeSpin;
      content.WinFreeSpinAmount = WinFreeSpinAmount;
      content.totalfreeSpin = totalfreeSpin;
      content.winInSpin = winInSpin;
      content.wildMultipliar = wildMultipliar;
      await upsertObject(content.email as string, content);
      const data = {
        viewZone,
        result,
        betAmount,
        wallet,
        freeSpin: checkPayline.freeSpin > 0 ? responceFreeSpin : 0,
        expandingWild: expanding_Wild.expandingWild,
        TotalWin: checkPayline.winAmount,
        wildMultipliar: expanding_Wild.wildMultipliarArray,
      };
      res.ok({ message: 'OK', data });
    } catch {
      res.notFound('NOT_FOUND');
    }
  };

  gameble = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const result = await getObject(req.token!.email);
      let winInSpin = result.content.winInSpin as number;
      let gamblecounter = result.content.gamblecounter as number;
      let gambleWin = result.content.gambleWin as number;
      const content = result.content as Record<string, unknown>;
      if (content.winInSpin === 0) {
        res.error('GAMBLE_RES');
        return;
      }
      const gameVariable = await getObject('MyJackpot');
      const gv = gameVariable.content as Record<string, unknown>;
      if ((gv.maxWinAmount as number) < winInSpin) {
        res.error('GAMBLE_FINISH');
        return;
      }
      const gambleResponse = gameHelper.conutGamble(req, result as { content: Record<string, unknown> }, gameVariable);
      winInSpin = gambleResponse.winInSpin;
      gamblecounter = gambleResponse.gamblecounter;
      gambleWin = gambleResponse.gambleWin;
      const gamble_history_new = gambleResponse.gambleHistory;
      content.gamble_history = gamble_history_new;
      content.winInSpin = winInSpin;
      content.gamblecounter = gamblecounter;
      content.gambleWin = gambleWin;
      await upsertObject(content.email as string, content);
      const data = {
        GambleWinTriggered: gambleResponse.winInSpin !== 0,
        gambleResponse,
      };
      res.ok({ message: 'OK', data });
    } catch {
      res.notFound('NOT_FOUND');
    }
  };

  collect = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const result = await getObject(req.token!.email);
      const content = result.content as Record<string, unknown>;
      if (content.winInSpin === 0) {
        res.error('COLLECT_RES');
        return;
      }
      const collectWallet = gameHelper.collectWallet(result as { content: Record<string, unknown> });
      content.wildMultipliar = collectWallet.wildMultipliar;
      content.winInSpin = collectWallet.winInSpin;
      content.wallet = collectWallet.wallet;
      content.gamblecounter = collectWallet.gamblecounter;
      await upsertObject(content.email as string, content);
      const data = {
        wallet: collectWallet.wallet,
        gambleWin: collectWallet.gambleWin > 0,
      };
      res.ok({ message: 'OK', data });
    } catch {
      res.notFound('NOT_FOUND');
    }
  };
}

export const slotGame = new SlotGame();
