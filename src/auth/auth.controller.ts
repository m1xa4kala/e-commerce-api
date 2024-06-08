import {
  Controller,
  Post,
  Body,
  BadRequestException,
  UnauthorizedException,
  Res,
  Get,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
import { Tokens } from './interfaces';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { Cookie, UserAgent } from '@app/common';

const REFRESH_TOKEN_COOKIE = 'refreshToken';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  private setRefreshCookie(@Res() res: Response, tokens: Tokens) {
    if (!tokens) {
      throw new UnauthorizedException();
    }
    res.cookie(REFRESH_TOKEN_COOKIE, tokens.refreshToken.token, {
      httpOnly: true,
      sameSite: 'lax',
      expires: new Date(tokens.refreshToken.expiresAt),
      secure:
        this.configService.get('NODE_ENV', 'development') === 'production',
      path: '/',
    });
    res.status(HttpStatus.CREATED).json({ accessToken: tokens.accessToken });
  }

  @Post('register')
  async register(@Body() data: RegisterDto) {
    const user = await this.authService.register(data);
    if (!user) {
      throw new BadRequestException('Something went wrong, try again');
    }
  }

  @Post('login')
  async login(
    @Body() data: LoginDto,
    @Res() res: Response,
    @UserAgent() userAgent: string,
  ) {
    const tokens = await this.authService.login(data, userAgent);
    if (!tokens) {
      throw new BadRequestException('Invalid email or password');
    }
    this.setRefreshCookie(res, tokens);
  }

  @Get('refresh')
  async refresh(
    @Cookie(REFRESH_TOKEN_COOKIE) refreshToken: string,
    @Res() res: Response,
    @UserAgent() userAgent: string,
  ) {
    if (!refreshToken) {
      throw new UnauthorizedException();
    }
    const tokens = await this.authService.refreshToken(refreshToken, userAgent);
    if (!tokens) {
      throw new UnauthorizedException();
    }
    this.setRefreshCookie(res, tokens);
  }
}
