import { Pipe, PipeTransform } from '@angular/core';
import { BookStatus } from '../../shared/book-list-table/model/book-status.enum';
import { BookStock } from '../../shared/book-list-table/model/book-stock.enum';

@Pipe({
  name: 'bookStock',
  standalone: true,
})
export class BookStockPipe implements PipeTransform {
  transform(value: BookStock): unknown {
    let text = '';
    switch (value) {
      case BookStock.SUFFICIENT:
        text = '○ 量足';
        break;
      case BookStock.LIMITED:
        text = '▲量少';
        break;
      case BookStock.OUT_OF_STOCK:
        text = '× 缺貨';
        break;
    }
    return text;
  }
}
