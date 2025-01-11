import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import {
  GetMeResponseDTO,
  SignInDto,
  SignUpDto,
} from '../dto/auth.controller.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { AuthUser } from '../decorators/auth-user.decorator';
import { AuthUserType } from '../types/auth-user.type';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  create(@Body() body: SignUpDto) {
    return this.authService.signUp(body);
  }

  @Post('sign-in')
  signIn(@Body() body: SignInDto) {
    return this.authService.signIn(body);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('me')
  async getMe(@AuthUser() user: AuthUserType) {
    return new GetMeResponseDTO(await this.authService.getMe(user.sub));
  }
}
