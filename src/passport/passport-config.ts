import passport, { PassportStatic } from 'passport';
import bcrypt from 'bcrypt';
import { Strategy as LocalStrategy } from 'passport-local';
import {
  ExtractJwt,
  Strategy as JwtStrategy,
  VerifiedCallback,
} from 'passport-jwt';

import { UserDocument } from '../models/v1/userModel.ts';

import User from '../models/v1/userModel.ts';

passport.use(
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (
      username: string,
      password: string,
      done: (
        error: Error | null,
        user?: UserDocument | false | undefined
      ) => void
    ) => {
      try {
        const user: UserDocument | null = await User.findOne({
          email: username,
        });

        if (!user) {
          return done(null, false);
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          return done(null, false);
        }

        return done(null, user);
      } catch (error) {
        done(error as Error | null);
      }
    }
  )
);

const opts: { jwtFromRequest: any; secretOrKey: string } = {
  jwtFromRequest: undefined,
  secretOrKey: '',
};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET || '';

passport.use(
  new JwtStrategy(opts, async function (
    jwt_payload: any,
    done: VerifiedCallback
  ) {
    try {
      return done(null, jwt_payload);
    } catch (err) {
      console.log(err);
      done(err);
    }
  })
);

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
