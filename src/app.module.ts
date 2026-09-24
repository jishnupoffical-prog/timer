import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { BatchModule } from './batch/batch.module';

@Module({
  imports: [BatchModule],
  controllers: [AppController],
})
export class AppModule {}
