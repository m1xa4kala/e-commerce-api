import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Category, Prisma } from '@prisma/client';
import { CategoryService } from './category.service';

@Controller('/categories')
export class CategoriesController {
  constructor(private readonly categoryService: CategoryService) {}
  @Get()
  findAll(): Promise<Category[]> {
    return this.categoryService.findAll({});
  }
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Category> {
    return this.categoryService.findOne(id);
  }
  @Post('')
  create(@Body() data: Prisma.CategoryCreateInput): Promise<Category> {
    return this.categoryService.createCategory(data);
  }
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() data: Prisma.CategoryUpdateInput,
  ): Promise<Category> {
    return this.categoryService.updateCategory({
      where: { id },
      data,
    });
  }
  @Delete(':id')
  delete(@Param('id') id: string): Promise<Category> {
    return this.categoryService.deleteCategory({
      id,
    });
  }
}
