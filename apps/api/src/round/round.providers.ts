import { DataSource } from 'typeorm';
import { RoundScore } from './round-score.entity';
import { Round } from './round.entity';

export const roundProviders = [
  {
    provide: 'ROUND_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Round),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'ROUND_SCORE_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(RoundScore),
    inject: ['DATA_SOURCE'],
  },
];
