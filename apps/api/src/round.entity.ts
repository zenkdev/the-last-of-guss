import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RoundScore } from './round-score.entity';

@Entity()
export class Round {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('timestamptz')
  startAt: Date;

  @Column('timestamptz')
  endAt: Date;

  @Column({ type: 'int', default: 0 })
  totalScore: number;

  @OneToMany(() => RoundScore, (roundScore) => roundScore.round)
  scores: RoundScore[];
}
