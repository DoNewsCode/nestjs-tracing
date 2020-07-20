/**
 * created at by Rain 2020/7/18
 */
import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

import { Request } from 'express';
import {
  FORMAT_HTTP_HEADERS,
  FORMAT_TEXT_MAP,
  Span,
  Tracer,
} from 'opentracing';
import { TRACER } from './constant';

@Injectable({ scope: Scope.REQUEST })
export class TracingService {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    @Inject(TRACER) private readonly tracer: Tracer,
  ) {}

  async span(serviceName: string, fun: () => any): Promise<any> {
    const ctx = this.tracer.extract(FORMAT_HTTP_HEADERS, this.request);
    const ctx2 = this.tracer.extract(FORMAT_TEXT_MAP, this.request.query);

    if ((ctx as any).isValid) {
    }

    let span: Span;
    if (ctx) {
      span = this.tracer.startSpan(serviceName, { childOf: ctx });
    } else {
      span = this.tracer.startSpan(serviceName);
    }

    const result = await Promise.resolve(fun());

    this.tracer.inject(span, FORMAT_TEXT_MAP, this.request);

    span.finish();
    return result;
  }
}
