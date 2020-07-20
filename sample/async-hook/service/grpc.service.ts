/**
 * created at by Rain 2020/7/18
 */
import { Injectable } from '@nestjs/common';
import { SpanD } from '../../../lib';

@Injectable()
export class GrpcService {
  @SpanD('GrpcService.SpanD')
  getService(): Promise<string> {
    return new Promise((resolve) => {
      const num = 1000 * Math.random();
      const str = num + ':grpcService';
      setTimeout(() => {
        resolve(str);
      }, num);
    });
  }
}
