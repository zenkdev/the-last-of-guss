import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Round } from './round.entity';

@Entity()
@Index(['roundId', 'userId'], { unique: true })
export class RoundScore {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid' })
  roundId: string;

  @Column()
  userId: number;

  @Column({ default: 0 })
  taps: number;

  @Column({ default: 0 })
  score: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Round, (round) => round.scores)
  round: Round;
}
