import Sequelize from 'sequelize';

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
export var Measurement = null;
export var Tracker = null;

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
         bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
       }
     },
     instanceMethods: {
       validPassword: password => {
         return bcrypt.compareSync(password, this.password);
       }
     }
   }); 

   Tracker = sequelize.define('tracker', {
     name: Sequelize.STRING
   });

   User.hasMany(Tracker);
   Tracker.belongsTo(User);

   Measurement = sequelize.define('measurement', {
     booleanValue: Sequelize.BOOLEAN,
     numericValue: Sequelize.DOUBLE
   });

   Tracker.hasMany(Measurement);
   Measurement.belongsTo(Tracker);

   sequelize.sync();
}

