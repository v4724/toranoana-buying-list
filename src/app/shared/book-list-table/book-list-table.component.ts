import { Component, computed, inject, input } from '@angular/core';
import { TableComponent } from '../table/table.component';
import { TableColumnDef } from '../table/interface/table-column.interface';
import { Book } from './model/book.interface';
import { BookStatusPipe } from '../../core/pipe/book-status.pipe';
import { BookStockColorPipe } from '../../core/pipe/book-stock-color.pipe';
import { CommonModule } from '@angular/common';
import { BookStockPipe } from '../../core/pipe/book-stock.pipe';
import { CalBoardService } from '../../features/cal-board/service/cal-board.service';
import { BooksService } from '../../layout/main/service/books.service';
import { MatIconModule } from '@angular/material/icon';
import { UpdateBookInfoComponent } from '../../features/update-book-info/update-book-info.component';

@Component({
  selector: 'app-book-list-table',
  standalone: true,
  imports: [
    CommonModule,
    TableComponent,
    BookStatusPipe,
    BookStockPipe,
    BookStockColorPipe,
    MatIconModule,
    UpdateBookInfoComponent,
  ],
  templateUrl: './book-list-table.component.html',
  styleUrl: './book-list-table.component.scss',
})
export class BookListTableComponent {
  bookList = input<Book[]>([]);

  columns: TableColumnDef[] = [
    {
      name: 'previewImg',
      title: '',
      columnType: 'template',
      width: 150,
      sticky: true,
    },
    { name: 'bookTitle', title: '書名', columnType: 'template', width: 150 },
    {
      name: 'price',
      title: '價格(JPY)',
      columnType: 'template',
      sort: true,
      width: 100,
    },
    {
      name: 'status',
      title: '狀態',
      columnType: 'template',
      sort: true,
      width: 100,
    },
    {
      name: 'stock',
      title: '庫存',
      columnType: 'template',
      sort: true,
      width: 100,
    },
    {
      name: 'shippingSchedule',
      title: '運送週期',
      columnType: 'template',
      width: 200,
    },
    { name: 'bookSize', title: '尺寸' },
    { name: 'bookPages', title: '頁數', columnType: 'number' },
    {
      name: 'estWeight',
      title: '*重量(g)',
      columnType: 'template',
      width: 100,
    },
    {
      name: 'intlShipFee',
      title: '*國際運費(NT$)',
      columnType: 'template',
      width: 120,
    },
    { name: 'count', title: '數量', columnType: 'template', hidden: false },
    {
      name: 'totalPrice',
      title: '總價格(日圓)',
      columnType: 'template',
      hidden: false,
      width: 80,
    },
    {
      name: 'totalEstWeight',
      title: '*總重量\r\n(g)',
      columnType: 'template',
      hidden: false,
      width: 100,
    },
    {
      name: 'totalIntlShipFee',
      title: '*總國際運費(NT$)',
      columnType: 'template',
      hidden: false,
      width: 120,
    },
    {
      name: 'action',
      title: '',
      columnType: 'template',
      hidden: false,
    },
  ];

  booksService = inject(BooksService);

  calBoardService = inject(CalBoardService);

  /** 本數-1 */
  decreaseBookCnt(book: Book) {
    book.count -= 1;
    this.updateBookCntInfo(book);
    this.booksService.buyingBookCntChange.next({
      book,
      cnt: book.count,
      action: 'decreaseBookCnt',
    });
  }

  /** 本數+1 */
  increaseBookCnt(book: Book) {
    book.count += 1;
    this.updateBookCntInfo(book);
    this.booksService.buyingBookCntChange.next({
      book,
      cnt: book.count,
      action: 'increaseBookCnt',
    });
  }

  /** 本數 設定 */
  updateBookCnt(book: Book, inputEl: HTMLInputElement) {
    let cnt = Number(inputEl.value);
    if (Number.isNaN(cnt) || cnt < 1) {
      cnt = 1;
      inputEl.value = '1';
    }
    book.count = Number(cnt);
    this.updateBookCntInfo(book);
    this.booksService.buyingBookCntChange.next({
      book,
      cnt: book.count,
      action: 'increaseBookCnt',
    });
  }

  /** 更新數量相關欄位 */
  updateBookCntInfo(book: Book) {
    book.totalPrice = book.count * book.price;
    book.totalEstWeight = book.count * book.estWeight;

    const intlFreightPerG = this.calBoardService.intlFreightPerG();
    book.totalIntlShipFee = !Number.isNaN(intlFreightPerG)
      ? book.count * book.estWeight * intlFreightPerG
      : undefined;
  }

  removeBook(book: Book) {
    this.booksService.removeBook(book);
  }
}
