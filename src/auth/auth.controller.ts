import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  async login(
    @Body() body: { email: string; password: string; rememberMe: boolean },
  ) {
    const { email, password, rememberMe } = body;

    if (!email || !password) {
      throw new UnauthorizedException('Email and password are required');
    }

    return this.authService.login(email, password, rememberMe);
  }
}
