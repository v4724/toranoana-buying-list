import { Pipe, PipeTransform } from '@angular/core';
import { BookStatus } from '../book-list-table/model/book-status.enum';

@Pipe({
  name: 'bookStockColor',
  standalone: true,
})
export class BookStockColorPipe implements PipeTransform {
  transform(value: BookStatus): unknown {
    let color = '';
    switch (value) {
      case BookStatus.IN_STOCK:
      case BookStatus.PRE_ORDER:
        color = 'text-green-600';
        break;
      case BookStatus.LIMITED_IN_STOCK:
      case BookStatus.LIMITED_PRE_ORDER:
        color = 'text-red-700';
        break;
      case BookStatus.OUT_OF_STOCK:
        color = 'text-gray-400';
        break;
    }
    return color;
  }
}
