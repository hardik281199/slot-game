import JsonWebToken from 'jsonwebtoken';
import Bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { getObject, getObjectOrNull, upsertObject } from '../config/connection';
import { user } from '../helpers/user.helper';
import { UserContent } from '../types';

const comparePassword = (plain: string, hash: string): Promise<boolean> =>
  new Promise((resolve, reject) => {
    Bcrypt.compare(plain, hash, (err, result) => (err ? reject(err) : resolve(!!result)));
  });

type AuthRequest = Request & { validatedParams?: { email: string; password: string }; token?: { email: string } };

export async function register(req: AuthRequest, res: Response): Promise<void> {
  const payload = req.validatedParams ?? req.body;
  try {
    const account = user.buildUserData({ ...req, body: payload } as Request);
    const existing = await getObjectOrNull(payload.email);
    if (existing) {
      res.error('EXISTS');
      return;
    }
    await upsertObject(payload.email, account as unknown as Record<string, unknown>);
    res.ok({ message: 'REGISTRATION', data: undefined });
  } catch {
    res.error('SOMETHING_WENT_WRONG');
  }
}

export async function login(req: AuthRequest, res: Response): Promise<void> {
  const payload = req.validatedParams ?? req.body;
  try {
    const account = await getObjectOrNull(payload.email);
    if (!account) {
      res.notFound('FIRST_REG');
      return;
    }
    const content = (account.content || account.value) as UserContent;
    const match = await comparePassword(payload.password, content.password!);
    if (!match) {
      res.error('INVALID');
      return;
    }
    const token = JsonWebToken.sign({ email: content.email }, process.env.JWT_SECRET!);
    content.jwt = token;
    await upsertObject(content.email, content as unknown as Record<string, unknown>);
    res.ok({ message: 'USER_LOGIN', data: { token } });
  } catch {
    res.notFound('FIRST_REG');
  }
}

export async function logout(req: AuthRequest, res: Response): Promise<void> {
  try {
    const result = await getObject(req.token!.email);
    const content = result.content as UserContent;
    delete content.jwt;
    await upsertObject(req.token!.email, content as unknown as Record<string, unknown>);
    res.ok({ message: 'USER_LOGOUT' });
  } catch {
    res.error('SOMETHING_WENT_WRONG');
  }
}
