import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const { email, password, name } = createUserDto;

    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new ConflictException(`User with email ${email} already exists`);
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await this.prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
        },
      });

      return newUser;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'An error occurred during registration',
        );
      }
    }
  }

  async login(email: string, password: string, rememberMe: boolean) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('User with this email does not exist');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const payload = { userId: user.id };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshTokenExpiresIn = rememberMe ? '7d' : '1d';
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: refreshTokenExpiresIn,
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }
}
