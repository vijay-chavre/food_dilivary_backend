import { PassportStatic } from 'passport';
import {
  ExtractJwt,
  Strategy as JwtStrategy,
  VerifiedCallback,
} from 'passport-jwt';

const opts: { jwtFromRequest: any; secretOrKey: string } = {
  jwtFromRequest: undefined,
  secretOrKey: '',
};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET || '';

const jwtStrategy = (passport: PassportStatic) =>
  passport.use(
    new JwtStrategy(opts, async function (
      jwt_payload: any,
      done: VerifiedCallback
    ) {
      try {
        console.log(jwt_payload);
        return done(null, jwt_payload);
      } catch (err) {
        console.log(err);
        done(err);
      }
    })
  );

export default jwtStrategy;
