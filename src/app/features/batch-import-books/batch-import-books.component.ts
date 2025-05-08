import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BooksService } from '../../layout/main/service/books.service';
import { catchError, EMPTY, finalize, tap } from 'rxjs';
import { Book } from '../../shared/book-list-table/model/book.interface';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-batch-import-books',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    OverlayModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './batch-import-books.component.html',
  styleUrl: './batch-import-books.component.scss',
})
export class BatchImportBooksComponent {
  isOpen = false;

  url = new FormControl('');

  resultList: {
    url: string;
    isLoading: boolean;
    fetchSuccess: boolean | null;
    addSuccess: boolean | null;
    errText: string;
    book: Book | null;
  }[] = [];

  isLoading = signal<boolean>(false);

  booksService = inject(BooksService);

  addToList() {
    this.resultList = [];

    const url = this.url.value;
    if (url) {
      let list = [];
      if (url.includes(',')) {
        list = url.split(',');
      } else {
        list = url.split(' ');
      }
      this.resultList = list.map((url) => {
        return {
          url: url,
          isLoading: true,
          book: null,
          errText: '',
          fetchSuccess: null,
          addSuccess: null,
        };
      });

      this.isLoading.set(true);

      this.resultList.forEach((item) => {
        const findInList = this.booksService.findInList(null, item.url);
        if (findInList.find && findInList.book) {
          item.book = findInList.book;
          item.fetchSuccess = true;
          item.addSuccess = false;
          item.errText = `已加入「${findInList.listName}」`;
          return;
        }

        this.booksService
          .fetchProductInfo$(item.url, false)
          .pipe(
            tap((book) => {
              item.book = book;
              item.fetchSuccess = true;

              if (findInList.find) {
                item.errText = `已加入「${findInList.listName}」`;
              }
              item.addSuccess = !findInList.find;
            }),
            catchError((err) => {
              item.fetchSuccess = false;
              item.errText = `${err.status} ${err.statusText}`;
              return EMPTY;
            }),
            finalize(() => {
              item.isLoading = false;
            }),
          )
          .subscribe();
      });

      const interval = setInterval(() => {
        const hasLoading = this.resultList.find((item) => item.isLoading);
        if (!hasLoading) {
          const books = this.resultList
            .filter((item) => item.addSuccess)
            .map((item) => item.book)
            .filter((book) => !!book);
          this.booksService.addArrToBuyingList(books);
          this.isLoading.set(false);
          clearInterval(interval);
        }
      }, 1000);
    }
  }
}
