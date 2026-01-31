import { Router } from 'express';
import { slotGame } from '../controllers/game.controller';
import { checkAuthToken } from '../middlewares/checkAuthToken.middleware';

export const gameRouter = Router();

gameRouter.post('/spin', checkAuthToken(), slotGame.gameFunction.bind(slotGame));
gameRouter.post('/gamble', checkAuthToken(), slotGame.gameble.bind(slotGame));
gameRouter.post('/collect', checkAuthToken(), slotGame.collect.bind(slotGame));
