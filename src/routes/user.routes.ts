import { Router } from 'express';
import { getUserDetails } from '../controllers/user.controller';
import { checkAuthToken } from '../middlewares/checkAuthToken.middleware';

export const userRouter = Router();

userRouter.get('/userinfo', checkAuthToken(), getUserDetails);
