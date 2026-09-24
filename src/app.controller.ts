import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { existsSync } from 'fs';
import { join } from 'path';

@Controller()
export class AppController {
  @Get()
  home(@Res() res: Response): void {
    const file = join(process.cwd(), 'public', 'index.html');
    if (existsSync(file)) {
      res.sendFile(file);
    } else {
      res.status(200).json({
        message: 'Batch Countdown Timer API is running',
        endpoints: ['/api/time', '/api/batches'],
      });
    }
  }
}
