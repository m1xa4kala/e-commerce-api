import { Module } from '@nestjs/common';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [CategoryModule, ProductModule, UsersModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
