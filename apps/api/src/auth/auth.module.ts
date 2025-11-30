import { Module } from '@nestjs/common';
import { JwtModule, JwtSignOptions } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { authConstants } from './auth.constants';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: authConstants.secret,
      signOptions: {
        expiresIn: authConstants.expiresIn as JwtSignOptions['expiresIn'],
      },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
