import { Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Book } from '../../shared/book-list-table/model/book.interface';
import { BooksService } from '../../layout/main/service/books.service';
import { catchError, EMPTY, finalize } from 'rxjs';

@Component({
  selector: 'app-update-book-info',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
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
