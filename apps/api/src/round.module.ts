import { Module } from '@nestjs/common';
import { DatabaseModule } from './database.module';
import { RoundController } from './round.controller';
import { roundProviders } from './round.providers';
import { RoundService } from './round.service';

@Module({
  imports: [DatabaseModule],
  controllers: [RoundController],
  providers: [...roundProviders, RoundService],
  exports: [RoundService],
})
export class RoundModule {}
