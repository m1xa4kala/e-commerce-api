import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { options } from './config';
import { STRATEGIES } from './strategies';

@Module({
  controllers: [AuthController],
  providers: [AuthService, ...STRATEGIES],
  imports: [PassportModule, JwtModule.registerAsync(options()), UsersModule],
  exports: [AuthService],
})
export class AuthModule {}
