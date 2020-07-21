/**
 * Created by Rain on 2020/3/30
 */
import { initTracer, TracingConfig } from 'jaeger-client';
import * as opentracing from 'opentracing';

import { path2 } from './path2';
import { path3 } from './path3';

// See schema https://github.com/jaegertracing/jaeger-client-node/blob/master/src/configuration.js#L37
const config: TracingConfig = {
  serviceName: 'my-awesome-service1',
  sampler: {
    param: 1,
    type: 'const',
  },
};
const options = {
  tags: {
    server1: '1.1.2',
  },
};

const tracer = initTracer(config, options);

// const header = {} as any;
//
// function path1() {
//   return new Promise((resolve) => {
//     const span = tracer.startSpan('http-request');
//     span.log({ event: 'path1_request_start' });
//     // span.setBaggageItem('baggage', 'baggage');
//
//     setTimeout(() => {
//       span.log({ event: 'path1_request_end' });
//       tracer.inject(span, opentracing.FORMAT_HTTP_HEADERS, header);
//
//       span.finish();
//       resolve();
//     }, 1000 * Math.random());
//   });
// }
//
// async function main() {
//   await path1();
//   await path2(header);
//   await path3(header);
// }

// main();
