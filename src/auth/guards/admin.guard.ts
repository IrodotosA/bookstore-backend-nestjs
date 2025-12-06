import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const user = req.user;

    if (user?.role !== 'admin') {
      throw new ForbiddenException('Access denied, admin only');
    }

    return true;
  }
}
