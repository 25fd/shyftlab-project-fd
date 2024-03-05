import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(
        catchError((error) => {
          console.error('Error:', error.response || error);
          return throwError(() => error.response);
        }),
      )
      .pipe(
        map((data) => {
          return {
            statusCode: 200,
            result: data,
          };
        }),
      );
  }
}
