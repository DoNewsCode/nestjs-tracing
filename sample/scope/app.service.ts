/**
 * created at by Rain 2020/7/18
 */
import { Injectable } from '@nestjs/common';
import { DbService } from './service/db.service';
import { GrpcService } from './service/grpc.service';

import { TracingService } from '../../lib/tracing.service';

@Injectable()
export class AppService {
  constructor(
    private readonly dbService: DbService,
    private readonly grpcService: GrpcService,
    private readonly tracingService: TracingService,
  ) {}

  async get(): Promise<any> {
    const dbService = await this.tracingService.span('dbService.find', () =>
      this.dbService.find(),
    );
    const grpcService = await Promise.all([
      this.tracingService.span('grpcService.getService', () =>
        this.grpcService.getService(),
      ),
      this.tracingService.span('grpcService.getService', () =>
        this.grpcService.getService(),
      ),
    ]);

    return { dbService, grpcService };
  }
}
