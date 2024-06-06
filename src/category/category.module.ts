import { Module } from '@nestjs/common';
import { CategoriesController } from './category.controller';
import { CategoryService } from './category.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [CategoriesController],
  providers: [CategoryService],
  imports: [PrismaModule],
})
export class CategoryModule {}
