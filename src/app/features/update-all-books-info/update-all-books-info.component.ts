import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { BooksService } from '../../layout/main/service/books.service';
import { catchError, EMPTY, finalize } from 'rxjs';
import { OverlayModule } from '@angular/cdk/overlay';
import { Book } from '../../shared/book-list-table/model/book.interface';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-update-all-books-info',
  imports: [MatButtonModule, MatIconModule, OverlayModule],
  templateUrl: './update-all-books-info.component.html',
  styleUrl: './update-all-books-info.component.scss',
})
export class UpdateAllBooksInfoComponent {
  isOpen = false;

  result: { book: Book; errStatus: string; errText: string }[] = [];

  lastUpdateTime: string = '';

  isLoading = signal<boolean>(false);

  booksService = inject(BooksService);

  /** 更新所有本子資訊 */
  update() {
    this.isOpen = false;
    this.lastUpdateTime = '';
    this.result = [];
    const allBooks = [...this.booksService.buyingList.value].concat(
      this.booksService.wishList.value,
    );

    this.isLoading.set(true);
    allBooks.forEach((book) => {
      let errStatus = '',
        errText = '';
      this.booksService
        .fetchProductInfo$(book.url, false)
        .pipe(
          catchError((err) => {
            errStatus = err.status;
            errText = err.statusText;
            return EMPTY;
          }),
          finalize(() => {
            this.result.push({ book, errStatus, errText });
          }),
        )
        .subscribe();
    });

    const datePipe = new DatePipe('en-US');
    const interval = setInterval(() => {
      if (this.result.length === allBooks.length) {
        clearInterval(interval);
        this.isLoading.set(false);
        setTimeout(() => {
          this.lastUpdateTime =
            datePipe.transform(new Date(), 'yyyy/MM/dd HH:mm') ?? '';
        }, 0);
      }
    }, 1000);
  }
}
