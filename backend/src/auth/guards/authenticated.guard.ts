import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<any> {
    const req: Request = context.switchToHttp().getRequest();
    return req.isAuthenticated();
  }
}

// import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
// import { Request } from 'express';

// @Injectable()
// export class AuthenticatedGuard implements CanActivate {
//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const req: Request = context.switchToHttp().getRequest();
//     // console.log(req);
//     // return false;
//     return req.isAuthenticated();
//   }
// }
