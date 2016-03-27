import Sequelize from 'sequelize';
import bcrypt from 'bcrypt-nodejs';

export function createSequelize() { 

  var sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',

    pool: {
      max: 5,
      min: 0,
      idle: 10000
    },

    // SQLite only
    storage: './database.sqlite'
  });

  initializeModels(sequelize);
  return sequelize;
}

export var User = null;

function initializeModels(sequelize) {
   User = sequelize.define('user', {
     email: {
       type: Sequelize.STRING,
       unique: true,
     },
     password: Sequelize.STRING,
   },{
     classMethods: {
       generateHash: password => {
         return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
       }
     },
     instanceMethods: {
       validPassword: function(password) {
         return bcrypt.compareSync(password, this.password);
       }
     }
   }); 

   if(process.env.TEST_DATABASE){
     sequelize.sync({force: true});
   }else{
     sequelize.sync();
   }
}

