import { Pipe, PipeTransform } from '@angular/core';
import { BookStock } from '../book-list-table/model/book-stock.enum';

@Pipe({
  name: 'bookStockColor',
  standalone: true,
})
export class BookStockColorPipe implements PipeTransform {
  transform(value: BookStock): unknown {
    let color = '';
    switch (value) {
      case BookStock.SUFFICIENT:
        color = 'text-green-600';
        break;
      case BookStock.LIMITED:
        color = 'text-red-700';
        break;
      case BookStock.OUT_OF_STOCK:
        color = 'text-gray-400';
        break;
    }
    return color;
  }
}
