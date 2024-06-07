import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { hashSync, genSaltSync } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private hashPassword(password: string) {
    const saltRounds = +process.env.SALT_ROUNDS || 10;
    const salt = genSaltSync(saltRounds);
    return hashSync(password, salt);
  }

  createUser(user: Prisma.UserCreateInput) {
    const { email, password, name } = user;
    return this.prisma.user.create({
      data: { email, password: this.hashPassword(password), name },
    });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  updateUser(id: string, data: Prisma.UserUpdateInput) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  deleteUser(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}
