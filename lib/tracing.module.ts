import {
  DynamicModule,
  HttpModule,
  HttpService,
  Module,
  OnApplicationBootstrap,
  Provider,
} from '@nestjs/common';
import { initTracer, TracingConfig, TracingOptions } from 'jaeger-client';
import {
  FORMAT_HTTP_HEADERS,
  FORMAT_TEXT_MAP,
  Span,
  Tags,
  Tracer,
} from 'opentracing';
import { TRACER } from './constant';
import { TracingService } from './tracing.service';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import * as httpContext from 'express-http-context';
import { ModuleRef } from '@nestjs/core';
/**
 * Created by Rain on 2020/7/16
 */

@Module({
  providers: [TracingService],
  exports: [TracingService],
})
export class TracingModule implements OnApplicationBootstrap {
  constructor(private moduleRef: ModuleRef) {}

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
      imports: [HttpModule],
      module: TracingModule,
      providers,
      exports: [...providers, HttpModule],
    };
  }

  /**
   * 设置axios拦截器，增加tracing信息
   */
  onApplicationBootstrap(): void {
    this.moduleRef
      .get<HttpService>(HttpService)
      .axiosRef.interceptors.request.use(...this.interceptRequest());
    this.moduleRef
      .get<HttpService>(HttpService)
      .axiosRef.interceptors.response.use(...this.interceptResponse());
  }

  private interceptRequest() {
    return [
      (config: AxiosRequestConfig) => {
        const tracer = TracingModule.tracer;

        let context = httpContext.get('tracingInfo');
        if (!context) {
          context = {};
          httpContext.set('tracingInfo', context);
        }

        const ctx = tracer.extract(FORMAT_TEXT_MAP, context);

        let span: Span;
        if (ctx) {
          span = tracer.startSpan('http', { childOf: ctx });
        } else {
          span = tracer.startSpan('http');
        }
        span.addTags({ url: config.url, method: config.method });

        tracer.inject(span, FORMAT_HTTP_HEADERS, config.headers);

        const spanConfig: any = config;
        spanConfig.span = span;
        return spanConfig as AxiosRequestConfig;
      },
      (error: any) => Promise.reject(error),
    ];
  }

  private interceptResponse() {
    return [
      (response: AxiosResponse) => {
        const config = response.config as AxiosRequestConfig & { span: Span };
        config.span.log({
          result: response.data,
          statusCode: response.status,
        });
        config.span.finish();
        return response;
      },
      (error: any) => {
        const config = error.config as AxiosRequestConfig & { span: Span };
        config.span.log({
          result: error.response?.data,
          statusCode: error.response?.status,
        });
        config.span.setTag(Tags.ERROR, true);
        return Promise.reject(error);
      },
    ];
  }
}
