import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ListParamsDto {
  @ApiProperty({
    type: Number,
    required: false,
  })
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @IsOptional()
  @Type(() => Number)
  @Transform(({ value }: { value: number }) => (value > 0 ? value : 1))
  page = 1;

  @ApiProperty({
    type: Number,
    required: false,
  })
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @IsOptional()
  @Type(() => Number)
  @Transform(({ value }: { value: number }) =>
    value > 0 && value < 100 ? value : 20,
  )
  limit = 20;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsString()
  @Transform(({ value }) => (value === 'desc' ? 'DESC' : 'ASC'))
  @IsOptional()
  order: 'ASC' | 'DESC' = 'ASC';

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  orderField = 'created_at';

  getOrderedField() {
    return this.orderField;
  }

  public countOffset(): number {
    return (this.page - 1) * this.limit;
  }

  public toString(): string {
    const searchParams = new URLSearchParams();
    searchParams.append('page', String(this.page));
    searchParams.append('limit', String(this.limit));
    searchParams.append('order', this.order);
    searchParams.append('orderField', this.orderField);

    return searchParams.toString();
  }
}
