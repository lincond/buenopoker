import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    if (!request.session?.user) {
      response.redirect('/auth/login');
      return false;
    }

    const user = await this.authService.findOne(request.session?.user.id);
    if (!user) {
      response.redirect('/auth/login');
      return false;
    }

    request['user'] = user;
    return true;
  }
}
