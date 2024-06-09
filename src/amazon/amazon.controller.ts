import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AmazonService } from './amazon.service';
import { ListParamsDto } from 'src/shared/dtos/list-params.dto';
import { ListDto } from 'src/shared/dtos/list.dto';
import { Product } from 'src/infrastructure/models/product.entity';

@Controller('amazon')
export class AmazonController {
  constructor(private readonly amazonService: AmazonService) {}

  @Post('parse')
  async parse(@Query('categoryUrl') categoryUrl: string) {
    this.amazonService.parseProducts(categoryUrl);

    return { message: 'Task has been started.' };
  }

  @Get('products')
  async getProducts(
    @Query() listParamsDto: ListParamsDto,
  ): Promise<ListDto<Product>> {
    return await this.amazonService.getProducts(listParamsDto);
  }

  @Get('products/:id')
  async getProductById(@Param('id') id: string) {
    return await this.amazonService.getBy({ id });
  }

  @Get('products/asin/:asin')
  async getProductByAsin(@Param('asin') asin: string) {
    return await this.amazonService.getBy({ asin });
  }
}
