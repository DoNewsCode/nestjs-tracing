/**
 * Created by Rain on 2020/7/17
 */
import { Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { TracingHttpInterceptor } from '../../lib';

@Controller('/app')
@UseInterceptors(TracingHttpInterceptor)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async get(): Promise<any> {
    return await this.appService.get();
  }

  @Post()
  async post(): Promise<any> {
    return await this.appService.get();
  }
}
