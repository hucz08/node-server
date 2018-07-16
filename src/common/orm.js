import Sequelize from 'sequelize';
import Config from '../common/config';

module.exports = new Sequelize(Config.database, Config.dbUser, Config.dbPassword, {
  // the sql dialect of the database
  // currently supported: 'mysql', 'sqlite', 'postgres', 'mssql'
  dialect: Config.dbType,

  // custom host; default: localhost
  host: Config.dbHost,

  // custom port; default: dialect default
  port: Config.dbPort,

  // custom protocol; default: 'tcp'
  // postgres only, useful for Heroku
  protocol: null,

  // disable logging; default: console.log
  logging: true,

  // you can also pass any dialect options to the underlying dialect library
  // - default is empty
  // - currently supported: 'mysql', 'postgres', 'mssql'
  dialectOptions: {
    // socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock',
    supportBigNumbers: true,
    bigNumberStrings: true
  },

  // the storage engine for sqlite
  // - default ':memory:'
  // storage: 'path/to/database.sqlite',

  // disable inserting undefined values as NULL
  // - default: false
  omitNull: true,

  // a flag for using a native library or not.
  // in the case of 'pg' -- set this to true will allow SSL support
  // - default: false
  native: true,

  // Specify options, which are used when sequelize.define is called.
  // The following example:
  //   define: { timestamps: false }
  // is basically the same as:
  //   sequelize.define(name, attributes, { timestamps: false })
  // so defining the timestamps for each model will be not necessary
  define: {
    underscored: false,
    freezeTableName: true,
    charset: 'utf8',
    dialectOptions: {
      collate: 'utf8_general_ci'
    },
    timestamps: true
  },

  // similar for sync: you can define this to always force sync for models
  sync: {force: true},
  replication: {
    read: [
      {host: Config.dbHost, username: Config.dbUser, password: Config.dbPassword},
      {host: Config.dbHost, username: Config.dbUser, password: Config.dbPassword},
    ],
    write: {host: Config.dbHost, username: Config.dbUser, password: Config.dbPassword},
  },
  // pool configuration used to pool database connections
  pool: {
    max: 5,
    idle: 30000,
    acquire: 60000,
  },

  // isolation level of each transaction
  // defaults to dialect default
  // isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ
});

