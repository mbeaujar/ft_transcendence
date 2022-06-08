import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';

export class TestInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // Before request is handle
    return next.handle();

    // return next.handle().pipe(
    //   map((data: any) => {
    //     // Before response is sent

    // 		return data;
    //   }),
    // );
  }
}
