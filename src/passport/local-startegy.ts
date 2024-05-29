import { Strategy as LocalStrategy } from 'passport-local';
import { UserDocument } from '../models/v1/User/userModel';
import User from '../models/v1/User/userModel';
import bcrypt from 'bcrypt';
import { PassportStatic } from 'passport';

const localStrategy = (passport: PassportStatic) =>
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

export default localStrategy;
