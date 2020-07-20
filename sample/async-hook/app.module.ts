/**
 * Created by Rain on 2020/7/17
 */
import { Module } from '@nestjs/common';
import { TracingConfig } from 'jaeger-client';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { DbService } from './service/db.service';
import { GrpcService } from './service/grpc.service';

import { TracingModule } from '../../lib';

const config: TracingConfig = {
  serviceName: 'nest-async-hook-server',
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

@Module({
  imports: [
    TracingModule.forRoot({ tracingConfig: config, tracingOption: options }),
  ],
  providers: [DbService, GrpcService, AppService],
  controllers: [AppController],
})
export class AppModule {}
