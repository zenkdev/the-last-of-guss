import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth.module';
import { RoundModule } from './round.module';
import { UserModule } from './user.module';
@Module({
  imports: [ConfigModule.forRoot(), UserModule, AuthModule, RoundModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
