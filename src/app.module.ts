import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [CategoryModule, ProductModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
