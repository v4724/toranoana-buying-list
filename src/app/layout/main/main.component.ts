import { Component, inject, OnInit, signal } from '@angular/core';
import { BookListTableComponent } from '../../shared/book-list-table/book-list-table.component';
import { Book } from '../../shared/book-list-table/model/book.interface';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CdkDragMove, DragDropModule } from '@angular/cdk/drag-drop';
import { CalBoardComponent } from '../../features/cal-board/cal-board.component';
import { BooksService } from './service/books.service';
import { MatButtonModule } from '@angular/material/button';
import { catchError, EMPTY, finalize, tap } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BatchImportBooksComponent } from '../../features/batch-import-books/batch-import-books.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    BatchImportBooksComponent,
    BookListTableComponent,
    CalBoardComponent,
    DragDropModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent implements OnInit {
  url = new FormControl('');

  buyingList: Book[] = [];

  wishList: Book[] = [];

  wishTableWidth = signal<string>('');

  fetchLoading = signal<boolean>(false);

  private booksService = inject(BooksService);

  constructor() {}

  ngOnInit() {
    this.booksService.buyingList.subscribe((list) => {
      this.buyingList = list;
    });

    this.booksService.wishList.subscribe((list) => {
      this.wishList = list;
    });
  }

  addToList() {
    const url = this.url.value;
    if (url) {
      this.fetchLoading.set(true);
      const findInList = this.booksService.findInList(null, url);
      if (findInList.find) {
        window.alert(findInList.msg);
        this.fetchLoading.set(false);

        return;
      }
      this.booksService
        .fetchProductInfo$(url)
        .pipe(
          tap((book) => {
            this.booksService.addToBuyingList(book);
          }),
          catchError(() => {
            return EMPTY;
          }),
          finalize(() => {
            this.fetchLoading.set(false);
          }),
        )
        .subscribe();
    }
  }

  onDrag(event: CdkDragMove) {
    const width = event.pointerPosition.x - 24 - 4 - 2;
    this.wishTableWidth.set(width.toString());
  }
}
