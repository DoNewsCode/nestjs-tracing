/**
 * Created by Rain on 2020/7/17
 */
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { RequestTracingInterceptor } from '../../lib/request-tracing.interceptor';
import { AppService } from './app.service';

@Controller()
@UseInterceptors(RequestTracingInterceptor)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async get(): Promise<any> {
    return await this.appService.get();
  }
}
