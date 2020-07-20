/**
 * created at by Rain 2020/7/18
 */
import * as assert from 'assert';
import { Injectable } from '@nestjs/common';

import { DbService } from './service/db.service';
import { GrpcService } from './service/grpc.service';
import { get } from '../../lib';

@Injectable()
export class AppService {
  constructor(
    private readonly dbService: DbService,
    private readonly grpcService: GrpcService,
  ) {}

  async get(): Promise<any> {
    const dbService = await this.dbService.find();
    const grpcService = await this.grpcService.getService();

    assert.strictEqual(get('tracingId'), 'tracingId');

    return { dbService, grpcService };
  }
}
