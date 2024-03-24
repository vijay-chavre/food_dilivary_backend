import passport, { PassportStatic } from 'passport';
import localStrategy from './local-startegy.ts';
import jwtStrategy from './jwt-strategy.ts';

import { UserDocument } from '../models/v1/User/userModel.ts';

import User from '../models/v1/User/userModel.ts';

localStrategy(passport);
jwtStrategy(passport);

passport.serializeUser(
  (user: any, done: (error: Error | null, id?: string) => void) => {
    done(null, user._id.toString());
  }
);

passport.deserializeUser(
  async (
    id: string,
    done: (error: Error | null, user?: UserDocument | null) => void
  ) => {
    try {
      const user: UserDocument | null = await User.findById(id);
      done(null, user);
    } catch (error) {
      if (error instanceof Error) {
        done(error);
      } else {
        done(null);
      }
    }
  }
);

export default passport as PassportStatic;
