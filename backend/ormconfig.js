const dbConfig = {};

switch (process.env.NODE_ENV) {
  case 'production':
    Object.assign(dbConfig, {
      type: 'postgres',
      database: process.env.POSTGRES_DB,
      host: process.env.POSTGRES_HOST,
      port: process.env.POSTGRES_PORT,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      synchronize: true,
      entities: ['**/*.entity.js'],
    });
    break;
  case 'development':
    Object.assign(dbConfig, {
      type: 'sqlite',
      database: 'db.sqlite',
      synchronize: true,
      entities: ['**/*.entity.js'],
    });
    break;
  case 'test':
    Object.assign(dbConfig, {
      type: 'sqlite',
      database: 'test.sqlite',
      synchronize: true,
      entities: ['**/*.entity.ts'], // .ts only for testing environment
    });
    break;
  default:
    throw new Error('unknow environment');
}

module.exports = dbConfig;
