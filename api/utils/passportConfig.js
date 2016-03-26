import passportLocal from 'passport-local';
import { User } from '../models/index';

var LocalStrategy = passportLocal.Strategy;

export default function configPassport(passport) {
  passport.serializeUser( (user, done) => {
    return done(null, user.id);
  });

  passport.deserializeUser( (id, done) => {
    User.findOne({ where: {id: id} }).then( (user) => {
      done(null, user);
    }).catch((err) => {
      done(err, user);
    });
  });

  passport.use('local-signup', new LocalStrategy({usernameField: 'email', passwordField: 'password', passReqToCallback: true}, (req, email, password, done) => {
    process.nextTick(() => {
      User.findOne({where: {email: email}}).then(user => {
        if(user){
          return done(null, false);
        }else{
          let newUser = User.build({
            email: email,
            password: User.generateHash(password),
          });
          newUser.save().then(() => {
            done(null, newUser);
          }).catch(err => {
            done(err);
          });
        }
      }).catch((err) => {
        console.log(`Err ${err}`); 
        done(err);
      });
    });
  }));

  passport.use('local-login', new LocalStrategy({usernameField:'email', passwordField:'password', passReqToCallback: true}, (req, email, password, done) => {
    User.findOne({where: {email: email}}).then(user => {
      if(!user){
        return done(null, false);
      }

      if(!user.validPassword(password)){
        return done(null, false);
      }

      done(null, user);
    }).catch(err => {
      done(err);
    });

  }));
  
}
