/**
 * created at by Rain 2020/7/18
 */
import { Injectable } from '@nestjs/common';

@Injectable()
export class DbService {
  find(): Promise<number> {
    return new Promise((resolve) => {
      const randomTime = 1000 * Math.random();
      setTimeout(() => {
        resolve(randomTime);
      }, randomTime);
    });
  }
}
