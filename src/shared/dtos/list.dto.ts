import { MetaInfo } from '../types/meta-info.type';
import { ListMetaDto } from './list-meta.dto';

export class ListDto<T> {
  data: Array<T>;
  meta: ListMetaDto;
  constructor(
    data: Array<T>,
    { page, itemsCount, limit, orderField, order }: MetaInfo,
  ) {
    this.data = data;
    this.meta = new ListMetaDto();
    this.meta.page = page;
    this.meta.itemsCount = itemsCount;
    this.meta.limit = limit;
    this.meta.returned = data.length;
    this.meta.offset = (page - 1) * limit;
    this.meta.pagesCount = Math.ceil(itemsCount / limit);
    this.meta.order = order;
    this.meta.orderField = orderField;
  }
}
