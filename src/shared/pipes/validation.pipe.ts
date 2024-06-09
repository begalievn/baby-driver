import { ValidationPipe } from '@nestjs/common';

export const commonValidationPipe = new ValidationPipe({
  transform: true,
  whitelist: true,
});
