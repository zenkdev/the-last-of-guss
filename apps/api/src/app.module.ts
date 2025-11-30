import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { RoundModule } from './round/round.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [ConfigModule.forRoot(), UserModule, AuthModule, RoundModule],
})
export class AppModule {}
