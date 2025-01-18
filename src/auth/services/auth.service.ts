import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AUTH_ERRORS } from '../constants';
import { Repository } from 'typeorm';
import { compare, hash } from 'bcrypt';
import { User } from '../entities/user.entity';
import { SignInDto, SignUpDto } from '../dto/auth.controller.dto';
import { JwtService } from '@nestjs/jwt';
const normalizeEmail = require('normalize-email');

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(body: SignUpDto): Promise<{ accessToken: string }> {
    const normalizedEmail = normalizeEmail(body.email);
    const existingUser = await this.usersRepository.findOneBy({
      normalizedEmail,
    });
    if (existingUser) {
      throw new BadRequestException(AUTH_ERRORS.EMAIL_ALREADY_EXISTS);
    }
    const hashedPassword = await hash(body.password, 10);
    const user = await this.usersRepository.save({
      fullName: body.fullName,
      email: body.email,
      normalizedEmail,
      password: hashedPassword,
    });
    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      name: user.fullName,
    });
    return {
      accessToken,
    };
  }

  async signIn(body: SignInDto): Promise<{ accessToken: string }> {
    const normalizedEmail = normalizeEmail(body.email);
    const existingUser = await this.usersRepository.findOneBy({
      normalizedEmail,
    });
    if (!existingUser) {
      throw new NotFoundException(AUTH_ERRORS.INVALID_CREDENTIALS);
    }
    const isValid = await compare(body.password, existingUser.password);
    if (!isValid) {
      throw new UnauthorizedException(AUTH_ERRORS.INVALID_CREDENTIALS);
    }
    const accessToken = await this.jwtService.signAsync({
      sub: existingUser.id,
      name: existingUser.fullName,
    });
    return {
      accessToken,
    };
  }

  async getMe(userId: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(AUTH_ERRORS.USER_NOT_FOUND);
    }
    return user;
  }
}
