/**
 * Created by Rain on 2020/7/22
 */
import { Test } from '@nestjs/testing';
import { AsyncContext, AsyncHooksModule } from '../lib/hook';
import * as assert from 'assert';

describe('hook module', () => {
  let asyncContext: AsyncContext;
  beforeEach(async () => {
    const asyncModule = await Test.createTestingModule({
      imports: [AsyncHooksModule],
    }).compile();
    asyncContext = asyncModule.get<AsyncContext>(AsyncContext);
    asyncContext.onModuleInit();
  });

  it('should 获得test', (done) => {
    asyncContext.run(() => {
      setTimeout(() => {
        asyncContext.set('test', { test: 1 });
        setTimeout(() => {
          assert.deepStrictEqual(asyncContext.get('test'), { test: 1 });
          done();
        }, 200);
      }, 200);
    });
  });

  it('should 获得test2', (done) => {
    AsyncContext.getInstance().run(() => {
      setTimeout(() => {
        AsyncContext.getInstance().set('test2', { test: 1 });
        setTimeout(() => {
          assert.deepStrictEqual(AsyncContext.getInstance().get('test2'), {
            test: 1,
          });
          done();
        }, 200);
      }, 200);
    });
  });
});
