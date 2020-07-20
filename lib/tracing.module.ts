/**
 * Created by Rain on 2020/7/16
 */
import { DynamicModule, Module, Provider } from '@nestjs/common';
import { initTracer, TracingConfig, TracingOptions } from 'jaeger-client';
import { Tracer } from 'opentracing';

import { TRACER } from './constant';
import { TracingService } from './tracing.service';

@Module({
  providers: [TracingService],
  exports: [TracingService],
})
export class TracingModule {
  static tracer: Tracer;

  static forRoot(option: {
    tracingConfig: TracingConfig;
    tracingOption: TracingOptions;
  }): DynamicModule {
    const { tracingConfig, tracingOption } = option;

    const tracer: Tracer = initTracer(tracingConfig, tracingOption);
    TracingModule.tracer = tracer;

    const providers: Provider[] = [];
    const tracerProvider: Provider = {
      provide: TRACER,
      useValue: tracer,
    };
    providers.push(tracerProvider);

    return {
      module: TracingModule,
      providers,
      exports: providers,
    };
  }
}
