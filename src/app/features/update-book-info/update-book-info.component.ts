import { Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Book } from '../../shared/book-list-table/model/book.interface';
import { BooksService } from '../../layout/main/service/books.service';
import { catchError, EMPTY, finalize, tap } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-update-book-info',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './update-book-info.component.html',
  styleUrl: './update-book-info.component.scss',
})
export class UpdateBookInfoComponent {
  book = input.required<Book>();

  booksService = inject(BooksService);

  updateBook() {
    this.book().isLoading = true;

    this.booksService
      .fetchProductInfo$(this.book().url, false)
      .pipe(
        tap((book: Book) => {
          this.book().status = book.status;
          this.book().stock = book.stock;
          this.book().shippingSchedule = book.shippingSchedule;
        }),
        catchError((err) => {
          // TODO 失敗提示
          return EMPTY;
        }),
        finalize(() => {
          this.book().isLoading = false;
        }),
      )
      .subscribe();
  }
}
