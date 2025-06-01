import 'express-session';
import { Session } from 'express-session';

declare module 'express-session' {
  interface SessionData {
    mode?: 'login' | 'signup';
  }
}

declare global {
  namespace Express {
    interface Request {
      // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
      session: Session & Partial<Record<string, unknown>>;
    }
  }
}
