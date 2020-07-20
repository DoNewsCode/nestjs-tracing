/**
 * Created by Rain on 2020/7/17
 */
import { initTracer, TracingConfig } from 'jaeger-client';
import * as opentracing from 'opentracing';

// See schema https://github.com/jaegertracing/jaeger-client-node/blob/master/src/configuration.js#L37
const config: TracingConfig = {
  serviceName: 'my-awesome-service2',
  sampler: {
    param: 1,
    type: 'const',
  },
};
const options = {
  tags: {
    server2: '1.1.2',
  },
};
const tracer = initTracer(config, options);

export function path2(headers: Record<string, string>): Promise<any> {
  return new Promise((resolve) => {
    const ctx = tracer.extract(opentracing.FORMAT_HTTP_HEADERS, headers);
    if (!ctx) {
      throw new Error('throw error');
    }

    const span = tracer.startSpan('http-request', { childOf: ctx });

    span.log({ event: 'path2_request_start', ctx });
    setTimeout(() => {
      span.log({ event: 'path2_request_end' });
      span.finish();
      resolve();
    }, 1000 * Math.random());
  });
}
