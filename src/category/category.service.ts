import { Injectable } from '@nestjs/common';
import { Category, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prismaService: PrismaService) {}

  async findOne(id: string): Promise<Category | null> {
    return this.prismaService.category.findUnique({
      where: { id },
    });
  }

  async findAll(params: { skip?: number; take?: number }): Promise<Category[]> {
    const { skip, take } = params;
    return this.prismaService.category.findMany({
      skip,
      take,
    });
  }

  async createCategory(data: Prisma.CategoryCreateInput): Promise<Category> {
    return this.prismaService.category.create({
      data,
    });
  }

  async updateCategory(params: {
    where: Prisma.CategoryWhereUniqueInput;
    data: Prisma.CategoryUpdateInput;
  }): Promise<Category> {
    const { where, data } = params;
    return this.prismaService.category.update({
      data,
      where,
    });
  }

  async deleteCategory(
    where: Prisma.CategoryWhereUniqueInput,
  ): Promise<Category> {
    return this.prismaService.category.delete({
      where,
    });
  }
}
