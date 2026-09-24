import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { Express } from 'express';
import { AppModule } from './app.module';

let cachedAppPromise: Promise<Express> | null = null;

export function createExpressApp(): Promise<Express> {
  if (!cachedAppPromise) {
    cachedAppPromise = (async () => {
      const expressApp = express();
      const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
      await app.init();
      return expressApp;
    })();
  }
  return cachedAppPromise;
}