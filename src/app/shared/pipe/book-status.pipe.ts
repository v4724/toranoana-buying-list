import { Pipe, PipeTransform } from '@angular/core';
import { BookStatus } from '../book-list-table/model/book-status.enum';

@Pipe({
  name: 'bookStatus',
  standalone: true,
})
export class BookStatusPipe implements PipeTransform {
  transform(value: BookStatus): unknown {
    let text = '';
    switch (value) {
      case BookStatus.IN_STOCK:
      case BookStatus.LIMITED_IN_STOCK:
        text = '現貨';
        break;
      case BookStatus.PRE_ORDER:
      case BookStatus.LIMITED_PRE_ORDER:
        text = '預約';
        break;
      case BookStatus.OUT_OF_STOCK:
        text = '-';
        break;
    }
    return text;
  }
}
