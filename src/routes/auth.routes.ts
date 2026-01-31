import { Router } from 'express';
import { login, register, logout } from '../controllers/auth.controller';
import { checkAuthToken } from '../middlewares/checkAuthToken.middleware';
import { requestValidator } from '../middlewares/requestValidator.middleware';
import { loginSchema, registerSchema } from '../validators/auth.validator';

export const authRouter = Router();

authRouter.post('/login', requestValidator(loginSchema), login);
authRouter.post('/register', requestValidator(registerSchema), register);
authRouter.post('/logout', checkAuthToken(), logout);
