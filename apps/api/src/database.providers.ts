import { DataSource } from 'typeorm';
import path from 'path';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: process.env.DATABASE_HOST || 'localhost',
        port: Number(process.env.DATABASE_PORT) || 5432,
        username: 'postgres', // process.env.DATABASE_USERNAME,
        password: 'RXp2p1ut@As', // process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        entities: [path.resolve(__dirname, './**/*.entity{.ts,.js}')],
        synchronize: true,
      });

      return dataSource.initialize();
    },
  },
];
