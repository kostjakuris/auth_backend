import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class OptionalJwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies['access_token'];

    if (!token) {
      request.user = null;
      return true;
    }
    try {
      request.user = this.jwtService.verify(token);
    } catch {
      request.user = null;
    }
    return true;
  }
}
