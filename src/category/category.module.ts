import { Module } from '@nestjs/common';
import { CategoriesController } from './category.controller';
import { CategoryService } from './category.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [CategoriesController],
  providers: [CategoryService, PrismaService],
})
export class CategoryModule {}
