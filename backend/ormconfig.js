const dbConfig = {};

switch (process.env.NODE_ENV) {
  case 'postgres':
    Object.assign(dbConfig, {
      type: 'postgres',
      database: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      synchronize: true,
      entities: ['**/*.entity.js'],
    });
    break;
  case 'development':
    Object.assign(dbConfig, {
      type: 'sqlite',
      database: process.env.DB_NAME,
      synchronize: true,
      entities: ['**/*.entity.js'],
    });
    break;
  case 'test':
    // Todo
    break;
  case 'production':
    // Todo
    break;
  default:
    throw new Error('unknow environment');
}

console.log(dbConfig);

module.exports = dbConfig;
