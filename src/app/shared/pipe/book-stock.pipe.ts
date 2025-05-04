import { Pipe, PipeTransform } from '@angular/core';
import { BookStatus } from '../book-list-table/model/book-status.enum';

@Pipe({
  name: 'bookStock',
  standalone: true,
})
export class BookStockPipe implements PipeTransform {
  transform(value: BookStatus): unknown {
    let text = '';
    switch (value) {
      case BookStatus.IN_STOCK:
      case BookStatus.PRE_ORDER:
        text = '○ 量足';
        break;
      case BookStatus.LIMITED_IN_STOCK:
      case BookStatus.LIMITED_PRE_ORDER:
        text = '▲量少';
        break;
      case BookStatus.OUT_OF_STOCK:
        text = '× 缺貨';
        break;
    }
    return text;
  }
}
