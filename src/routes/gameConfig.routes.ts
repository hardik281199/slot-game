import { Router } from 'express';
import { gameConfig } from '../controllers/gameConfig.controller';
import { requestValidator } from '../middlewares/requestValidator.middleware';
import { addGameSchema, editGameSchema } from '../validators/game.validator';

export const gameConfigRouter = Router();

gameConfigRouter.post('/games', requestValidator(addGameSchema), gameConfig.addGameObject.bind(gameConfig));
gameConfigRouter.put('/games/:gameName', requestValidator(editGameSchema), gameConfig.editGameObject.bind(gameConfig));
gameConfigRouter.delete('/games/:gameName', gameConfig.deletGameObject.bind(gameConfig));
gameConfigRouter.get('/games', gameConfig.indexing.bind(gameConfig));
gameConfigRouter.get('/gameInfo/:gameName', gameConfig.getGame.bind(gameConfig));
