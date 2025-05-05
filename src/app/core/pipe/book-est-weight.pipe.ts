import { Pipe, PipeTransform } from '@angular/core';
import { BookSize } from '../../shared/book-list-table/model/book-size.enum';

@Pipe({
  name: 'bookEstWeight',
  standalone: true,
})
export class BookEstWeightPipe implements PipeTransform {
  transform(value: number, size: BookSize): number {
    let num = 0;
    switch (size) {
      case BookSize.A5:
        num = value * 1.6;
        break;
      case BookSize.B5:
        num = value * 2.9;
        break;
    }
    return num;
  }
}
