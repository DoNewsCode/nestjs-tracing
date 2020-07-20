/**
 * Created by Rain on 2020/7/17
 */
import {
  CallHandler,
  ExecutionContext,
  Inject,
  NestInterceptor,
} from '@nestjs/common';
import {
  FORMAT_HTTP_HEADERS,
  FORMAT_TEXT_MAP,
  Span,
  Tags,
  Tracer,
} from 'opentracing';
import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { TRACER } from './constant';
import SpanContext from 'opentracing/src/span_context';

export class RequestTracingInterceptor implements NestInterceptor {
  constructor(@Inject(TRACER) private readonly tracer: Tracer) {}
  intercept(context: ExecutionContext, next: CallHandler): any {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const ctx = this.tracer.extract(FORMAT_HTTP_HEADERS, request);
    const ctx2 = this.tracer.extract(FORMAT_TEXT_MAP, request.query);

    let mergeContext: null | SpanContext = null;
    if ((ctx as any).isValid) {
      mergeContext = ctx;
    }
    if ((ctx as any).isValid) {
      mergeContext = ctx2;
    }

    let span: Span;
    if (mergeContext) {
      span = this.tracer.startSpan('test', { childOf: mergeContext });
    } else {
      span = this.tracer.startSpan('test');
    }
    span.setTag('url', request.url);
    span.setTag('method', request.method);

    return next.handle().pipe(
      catchError((err) => {
        span.setTag(Tags.ERROR, true);
        span.log({
          'err.stack': err.stack,
          statusCode: response.statusCode,
        });
        span.finish();
        return throwError(err);
      }),
      tap((result) => {
        span.log({
          result,
          statusCode: response.statusCode,
        });
        span.finish();
      }),
    );
  }
}
