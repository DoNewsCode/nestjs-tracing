/**
 * Created by Rain on 2020/7/20
 */
import { Test } from '@nestjs/testing';
import { TracingModule } from '../lib';
import Span from 'opentracing/lib/span';
import { HttpService } from '@nestjs/common';

describe('http module', () => {
  let service: HttpService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TracingModule.forRoot({
          tracingOption: {},
          tracingConfig: { serviceName: 'foo' },
        }),
      ],
    }).compile();
    service = moduleRef.get(HttpService);
  });
  it('should start tracing span', async () => {
    const tracer = TracingModule.tracer;
    jest.spyOn(tracer, 'startSpan');
    const result = await service.get('http://jd.com', {}).toPromise();
    expect(tracer.startSpan).toBeCalled;
  });
});
