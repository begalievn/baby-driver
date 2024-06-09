import { BaseEntity } from 'src/shared/models/base-entity';
import { Column, Entity } from 'typeorm';

@Entity('product')
export class Product extends BaseEntity {
  @Column({ type: 'text', unique: true })
  asin: string;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'decimal' })
  price: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text' })
  currency: string;

  @Column({ type: 'text' })
  url: string;

  @Column({ name: 'image_url', type: 'text' })
  imageUrl: string;
}
