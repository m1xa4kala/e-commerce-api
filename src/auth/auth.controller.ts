import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() data: RegisterDto) {
    const user = await this.authService.register(data);
    if (!user) {
      throw new BadRequestException(`Email ${data.email} already exists`);
    }
  }

  @Post('login')
  async login(@Body() data: LoginDto) {
    const tokens = this.authService.login(data);
    if (!tokens) {
      throw new BadRequestException('Invalid email or password');
    }
  }
}
