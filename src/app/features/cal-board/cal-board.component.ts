import { Component, computed, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BooksService } from '../../layout/main/service/books.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule, DecimalPipe } from '@angular/common';
import { CalBoardService } from './service/cal-board.service';
import { UpdateAllBooksInfoComponent } from '../update-all-books-info/update-all-books-info.component';

@Component({
  selector: 'app-cal-board',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    UpdateAllBooksInfoComponent,
  ],
  templateUrl: './cal-board.component.html',
  styleUrl: './cal-board.component.scss',
})
export class CalBoardComponent implements OnInit {
  decimalPipe = new DecimalPipe('en-US');

  booksService = inject(BooksService);

  calBoardService = inject(CalBoardService);

  buyingList = toSignal(this.booksService.buyingList);

  formGroup = this.calBoardService.formGroup;

  /** 本數 */
  cnt = computed(() => {
    const list = this.buyingList();
    const buyingBookCntChange$ = this.booksService.buyingBookCntChange$();
    return list
      ? this.decimalPipe.transform(
          list.reduce((sum, book) => {
            return sum + book.count;
          }, 0),
          '1.0-0',
        )
      : '-';
  });

  /** 總價(JPY) */
  totalPriceJPY = computed(() => {
    const list = this.buyingList();
    const buyingBookCntChange$ = this.booksService.buyingBookCntChange$();
    const toranoanaFreight =
      Number(this.calBoardService.toranoanaFreightValueChanges()) ?? 0;

    return list
      ? list.reduce((sum, book) => {
          return sum + book.totalPrice;
        }, toranoanaFreight)
      : '-';
  });

  /** 總價(NT$) */
  totalPriceNT$ = computed(() => {
    const exchangeRate = this.calBoardService.exchangeRateValueChanges();
    const totalPriceJPY = this.totalPriceJPY();
    const valid = !Number.isNaN(totalPriceJPY) && !!exchangeRate;

    return valid ? Number(totalPriceJPY) * exchangeRate : '-';
  });

  /** 總重(g) */
  totalW = computed(() => {
    const list = this.buyingList();
    const buyingBookCntChange$ = this.booksService.buyingBookCntChange$();
    return list
      ? list.reduce((sum, book) => sum + book.totalEstWeight, 0)
      : '-';
  });

  /** 預估總運費(NT$) */
  totalFreight = computed(() => {
    const intlFreightPerG = this.calBoardService.intlFreightPerG();
    const totalW = this.totalW();
    const valid =
      !Number.isNaN(totalW) && (intlFreightPerG === 0 || !!intlFreightPerG);
    return valid
      ? this.decimalPipe.transform(Number(totalW) * intlFreightPerG, '1.0-0')
      : '-';
  });

  ngOnInit() {}
}
