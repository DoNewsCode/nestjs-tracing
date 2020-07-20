/**
 * Created by Rain on 2020/7/17
 */
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { set } from '../../lib/index';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async get(): Promise<any> {
    set('tracingId', 'tracingId');
    return await this.appService.get();
  }
}
