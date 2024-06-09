import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BaseDto } from '../dtos/base.dto';

const NODE_ENV = process.env.NODE_ENV;
const isTests = NODE_ENV === 'test';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: isTests ? 'datetime' : 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: isTests ? 'datetime' : 'timestamp' })
  updated_at: Date;

  absorbFromDto(dto: BaseDto) {
    dto.getKeys().forEach((key: string) => {
      this[key] = dto[key];
    });
    return this;
  }

  toDto<T extends BaseDto>(dto: T): T {
    this.getKeys().forEach((key: string) => {
      dto[key] = this[key];
    });
    return dto;
  }

  private getKeys() {
    return Object.keys(this);
  }
}
