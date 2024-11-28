import {
  Body,
  Controller,
  Get,
  Post,
  Redirect,
  Render,
  Res,
  Session,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

declare module 'express-session' {
  interface SessionData {
    user?: User;
  }
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('')
  @Redirect('/auth/login')
  index() {}

  @Get('/login')
  @Render('auth/login')
  async getLoginPage() {}

  @Post('/login')
  async login(
    @Session() session: Record<string, any>,
    @Res() response: Response,
    @Body() { email, password }: LoginDto,
  ) {
    try {
      const user = await this.authService.login(email, password);
      session.user = user;

      // TODO: redirect to ?redirect=<route>
      response.redirect('/');
    } catch (error) {
      response.render('auth/login', { error });
    }
  }

  @Get('/register')
  @Render('auth/register')
  async getRegisterPage() {}

  @Post('/register')
  async register(
    @Session() session: Record<string, any>,
    @Res() response: Response,
    @Body() createUserDto: CreateUserDto,
  ) {
    try {
      const user = await this.authService.register(createUserDto);
      session.user = user;

      response.redirect('/');
    } catch (error) {
      response.render('auth/register', { error });
    }
  }

  @Get('/logout')
  @Redirect('/auth/login')
  async logout(@Session() session: Record<string, any>) {
    session.destroy();
  }
}
