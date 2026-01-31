import { Request, Response, NextFunction } from 'express';

export class Verify {
  credentialVerify(req: Request, res: Response, next: NextFunction): void | boolean {
    const email = req.body.email;
    const password = req.body.password;
    const emailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const passwordFormat = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!emailFormat.exec(email)) {
      return res.error('INVALID_EMAIL');
    }
    if (!passwordFormat.exec(password)) {
      return res.error('INVALID_PASSWORD');
    }
    if (!email) {
      return res.error('REQUIRE_EMAIL');
    }
    if (!password) {
      return res.error('REQUIRE_PASSWORD');
    }
    next();
  }
}

export const verify = new Verify();
