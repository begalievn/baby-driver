import { Module } from '@nestjs/common';
import { AmazonController } from './amazon.controller';
import { AmazonService } from './amazon.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/infrastructure/models/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [AmazonController],
  providers: [AmazonService],
})
export class AmazonModule {}
