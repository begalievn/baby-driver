import { Injectable } from '@nestjs/common';
import * as Promises from 'bluebird';
import { PlaywrightClass } from 'src/playwright/playwright';
import { Page } from 'playwright';
import { BaseService } from 'src/shared/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/infrastructure/models/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from 'src/infrastructure/dtos/create-product.dto';
import {
  extractAsin,
  extractCurrency,
  extractDescription,
  extractImgUrl,
  extractPrice,
  extractTitle,
  extractUrl,
} from 'src/infrastructure/functions/amazon-helpers';
import { ListParamsDto } from 'src/shared/dtos/list-params.dto';

@Injectable()
export class AmazonService extends BaseService<Product> {
  private parser = new PlaywrightClass();

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {
    super(productRepository);
  }

  async parseProducts(categoryUrl: string) {
    await this.parser.startBrowser();
    const page = await this.parser.newPage();
    const urlObj = new URL(categoryUrl);
    const urlOrigin = urlObj.origin;
    try {
      console.info('============ started parsing ==================');
      await page.goto(categoryUrl);
      await page.waitForLoadState();
      let hasMorePaginationItems = true;

      while (hasMorePaginationItems) {
        const createProductDtos = await this.scraper(page, urlOrigin);
        await Promises.map(
          createProductDtos,
          (productDto: CreateProductDto) => {
            return this.createOrUpdateProduct(productDto);
          },
          {
            concurrency: 5,
          },
        );
        const nextPageLink = await page.$(
          'a.s-pagination-item.s-pagination-next',
        );
        const currentPage = await page.$(
          'span.s-pagination-item.s-pagination-selected',
        );

        console.info('current page', await currentPage.innerText());

        if (nextPageLink) {
          await nextPageLink.click({ timeout: 10000 });
          await page.waitForTimeout(3000);
        } else {
          console.info('No pagination link');
          hasMorePaginationItems = false;
          break;
        }
      }

      console.info('============ completed parsing ================');
    } catch (error) {
      console.error(error);
    } finally {
      this.parser.closeBrowser();
    }
  }

  async scraper(page: Page, urlOrigin: string): Promise<CreateProductDto[]> {
    const products =
      (await page.$$('div[data-component-type="s-search-result"]')) || [];

    const productDtos: CreateProductDto[] = [];

    console.info(`Number of elements found: ${products.length}`);
    for (const element of products) {
      const asin = await extractAsin(element);
      const title = await extractTitle(element);
      const description = await extractDescription(element);
      const price = await extractPrice(element);
      const currency = await extractCurrency(element);
      const imageUrl = await extractImgUrl(element);
      const url = await extractUrl(element, urlOrigin);
      if (!asin || !title || !price) continue;

      const productDto = CreateProductDto.parse(
        {
          asin,
          title,
          description,
          price,
          currency,
          imageUrl,
          url,
        },
        new CreateProductDto(),
      );
      productDtos.push(productDto);
    }

    return productDtos || [];
  }

  async getProducts(listParamsDto: ListParamsDto) {
    return await this.list(listParamsDto);
  }

  async createOrUpdateProduct(productData: CreateProductDto) {
    const { asin } = productData;
    const productExists = await this.getBy({ asin }, {}, false);
    if (productExists) {
      productExists.absorbFromDto(productData);
      return this.productRepository.save(productExists);
    }

    const newProduct = new Product();
    newProduct.absorbFromDto(productData);

    return this.productRepository.save(newProduct);
  }
}
