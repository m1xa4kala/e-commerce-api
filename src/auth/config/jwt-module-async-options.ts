import { JwtModuleAsyncOptions } from '@nestjs/jwt';

export const options = (): JwtModuleAsyncOptions => ({
  inject: [process.env.JWT_SECRET, process.env.JWT_EXPIRES_IN],
  useFactory: () => ({
    secret: process.env.JWT_SECRET || 'JWT_SECRET',
    signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '3600s' },
  }),
});
