import type { INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';

export function pipesSetup(app: INestApplication): void {
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
}
