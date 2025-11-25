import { Module } from '@nestjs/common';
import { DatabaseModule } from './database.module';
import { TokenService } from './token.service';
import { UserController } from './user.controller';
import { userProviders } from './user.providers';
import { UserService } from './user.service';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [...userProviders, UserService, TokenService],
  exports: [UserService],
})
export class UserModule {}
