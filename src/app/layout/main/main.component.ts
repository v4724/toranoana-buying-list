import { Component, inject, OnInit, signal } from '@angular/core';
import { BookListTableComponent } from '../../shared/book-list-table/book-list-table.component';
import { Book } from '../../shared/book-list-table/model/book.interface';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  CdkDrag,
  CdkDragMove,
  CdkDropListGroup,
  DragDropModule,
} from '@angular/cdk/drag-drop';
import { CalBoardComponent } from '../../features/cal-board/cal-board.component';
import { BooksService } from './service/books.service';
import { MatButtonModule } from '@angular/material/button';
import { finalize, tap } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    MatButtonModule,
    CalBoardComponent,
    DragDropModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    BookListTableComponent,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent implements OnInit {
  url = new FormControl('https://ecs.toranoana.jp/joshi/ec/item/040031226821/');

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
      this.booksService
        .fetchProductInfo$(url)
        .pipe(
          tap((book) => {
            this.booksService.addToBuyingList(book);
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
    console.log(event.pointerPosition, width);
    this.wishTableWidth.set(width.toString());
  }
}
