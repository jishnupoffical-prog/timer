import { Controller, Get } from '@nestjs/common';
import { BatchService } from './batch.service';

@Controller('api')
export class BatchController {
  constructor(private readonly batchService: BatchService) {}

  @Get('time')
  getTime() {
    return this.batchService.getStatus();
  }

  @Get('batches')
  getBatches() {
    return this.batchService.getAll();
  }
}
