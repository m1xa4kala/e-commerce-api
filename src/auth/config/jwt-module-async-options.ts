import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions } from '@nestjs/jwt';

export const options = (): JwtModuleAsyncOptions => ({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => ({
    secret: configService.get('JWT_SECRET') || 'JWT_SECRET',
    signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN') || '3600s' },
  }),
});
