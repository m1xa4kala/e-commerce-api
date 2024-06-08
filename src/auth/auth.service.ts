import { UsersService } from './../users/users.service';
import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto';
import { Tokens } from './interfaces';
import { compare } from 'bcrypt';
import { Token, User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 } from 'uuid';
import { add } from 'date-fns';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  private async createRefreshToken(userId: string): Promise<Token> {
    return this.prismaService.token.create({
      data: {
        token: v4(),
        expiresAt: add(new Date(), { months: 1 }),
        userId,
      },
    });
  }

  private async generateTokens(user: User): Promise<Tokens> {
    const accessToken =
      'Bearer ' +
      (await this.jwtService.signAsync({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      }));
    const refreshToken = await this.createRefreshToken(user.id);
    return { accessToken, refreshToken };
  }

  async register(data: RegisterDto) {
    const { email, password, passwordConfirmation } = data;
    if (!email || !password || !passwordConfirmation) {
      throw new BadRequestException('Please provide all fields');
    }
    const user = await this.usersService
      .findByEmail(data.email)
      .catch((error) => {
        this.logger.error(error);
        return null;
      });
    if (user) {
      throw new BadRequestException('User already exists');
    }
    return this.usersService.createUser(data).catch((error) => {
      this.logger.error(error);
      return null;
    });
  }

  async login(data: LoginDto): Promise<Tokens> {
    const user: User = await this.usersService
      .findByEmail(data.email)
      .catch((error) => {
        this.logger.error(error);
        return null;
      });

    if (!user || !(await compare(data.password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.generateTokens(user);
  }

  async refreshToken(refreshToken: string): Promise<Tokens> {
    const token = await this.prismaService.token
      .findUnique({
        where: { token: refreshToken },
      })
      .catch((error) => {
        this.logger.error(error);
        return null;
      });
    if (!token) {
      throw new BadRequestException('Invalid refresh token');
    }
    if (token.expiresAt < new Date()) {
      throw new BadRequestException('Refresh token expired');
    }
    const user = await this.prismaService.user
      .findUnique({
        where: { id: token.userId },
      })
      .catch((error) => {
        this.logger.error(error);
        return null;
      });
    if (!user) {
      throw new BadRequestException('Invalid refresh token');
    }
    await this.prismaService.token.delete({ where: { token: token.token } });
    return this.generateTokens(user);
  }
}
