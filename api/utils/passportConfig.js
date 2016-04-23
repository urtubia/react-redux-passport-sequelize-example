import passportLocal from 'passport-local';
import { User } from '../models/index';

var LocalStrategy = passportLocal.Strategy;

export default function configPassport(passport) {
  passport.serializeUser( (user, done) => {
    done(null, user.id);
    return null;
  });

  passport.deserializeUser( (id, done) => {
    User.findOne({ where: {id: id} }).then( (user) => {
      done(null, user);
      return null;
    }).catch((err) => {
      done(err, user);
      return null;
    });
  });

  passport.use('local-signup', new LocalStrategy({usernameField: 'email', passwordField: 'password', passReqToCallback: true}, (req, email, password, done) => {
    process.nextTick(() => {
      User.findOne({where: {email: email}}).then(user => {
        if(user){
          return null;
        }else{
          let newUser = User.build({
            email: email,
            password: User.generateHash(password),
          });
          return newUser.save();
        }
      }).then(newUser => {
          done(null, newUser);
          return null;
      }).catch(err => {
        console.log(`Err ${err}`); 
        done(err);
        return null;
      });

    })}));

  passport.use('local-login', new LocalStrategy({usernameField:'email', passwordField:'password', passReqToCallback: true}, (req, email, password, done) => {
    User.findOne({where: {email: email}}).then(user => {
      if(!user){
        done(null, false);
        return null;
      }

      if(!user.validPassword(password)){
        done(null, false);
        return null;
      }

      done(null, user);
      return null;
    }).catch(err => {
      done(err);
      return null;
    });

  }));
  
}
