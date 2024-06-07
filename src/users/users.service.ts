import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash, genSalt } from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  private async hashPassword(password: string) {
    const saltRounds = +this.configService.get('SALT_ROUNDS') || 10;
    const salt = await genSalt(saltRounds);
    return hash(password, salt);
  }

  async createUser(userDTO: Prisma.UserCreateInput) {
    const { email, password, name } = userDTO;
    return await this.prisma.user.create({
      data: { email, password: await this.hashPassword(password), name },
    });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findById(id: string) {
    if (!id) {
      throw new BadRequestException('Id not provided');
    }
    try {
      return this.prisma.user.findUnique({ where: { id } });
    } catch (error) {
      return null;
    }
  }

  findByEmail(email: string) {
    if (!email) {
      throw new BadRequestException('Email not provided');
    }
    try {
      const user = this.prisma.user.findUnique({ where: { email } });
      return user;
    } catch (error) {
      return null;
    }
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
