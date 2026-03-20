import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {
  }
  
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies['access_token'];
    
    if (!token) {
      throw new UnauthorizedException({message: 'User was not athorized'});
    }
    try {
      request.user = this.jwtService.verify(token);
      return true;
    } catch (error) {
      throw new UnauthorizedException({message: error});
    }
  }
}