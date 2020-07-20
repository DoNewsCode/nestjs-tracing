/**
 * created at by Rain 2020/7/19
 */
import * as httpContext from 'express-http-context';
import { TracingModule } from '../tracing.module';
import { FORMAT_TEXT_MAP, Span, Tags } from 'opentracing';

export function SpanD(name: string): MethodDecorator {
  return (
    target: any,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    const original = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const tracer = TracingModule.tracer;

      let context = httpContext.get('tracingInfo');
      if (!context) {
        context = {};
        httpContext.set('tracingInfo', context);
      }

      const ctx = tracer.extract(FORMAT_TEXT_MAP, context);

      let span: Span;
      if (ctx) {
        span = tracer.startSpan(name, { childOf: ctx });
      } else {
        span = tracer.startSpan(name);
      }

      const result = original.apply(target, args);

      if (result.then) {
        result
          .then(() => {
            tracer.inject(span, FORMAT_TEXT_MAP, context);
            span.finish();
          })
          .catch(() => {
            tracer.inject(span, FORMAT_TEXT_MAP, context);
            span.setTag(Tags.ERROR, true);
            span.finish();
          });
      } else {
        span.finish();
      }

      return result;
    };
  };
}
