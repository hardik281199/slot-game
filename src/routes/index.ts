import { Router } from 'express';
import { authRouter } from './auth.routes';
import { userRouter } from './user.routes';
import { gameRouter } from './game.routes';
import { gameConfigRouter } from './gameConfig.routes';

export const router = Router();

router.use(authRouter);
router.use(userRouter);
router.use(gameRouter);
router.use(gameConfigRouter);
