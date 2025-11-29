import { Module } from '@nestjs/common';
import { DatabaseModule } from './database.module';
import { RoundController } from './round.controller';
import { roundProviders } from './round.providers';
import { RoundService } from './round.service';
import { userProviders } from './user.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [RoundController],
  providers: [...roundProviders, ...userProviders, RoundService],
  exports: [RoundService],
})
export class RoundModule {}
