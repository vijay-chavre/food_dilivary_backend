import passport from 'passport';
import bcrypt from 'bcrypt';
import { Strategy as LocalStrategy } from 'passport-local';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';

// User model (you may need to import your User model or define it here)
import User from '../models/v1/userModel.ts';
import { CustomError } from '../utils/errorhandler.ts';

passport.use(
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (username, password, done) => {
      try {
        const user = await User.findOne({ email: username });
        if (!user) {
          console.log('Incorrect username');
          throw new CustomError('User Not Found', 400);
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          console.log('Incorrect password');
          throw new CustomError('Password is incorrect', 400);
        }
        return done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);

const opts: any = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;
console.log(opts);
passport.use(
  new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
      return done(null, jwt_payload);
    } catch (err) {
      console.log(err);
      done(err);
    }
  })
);

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;
