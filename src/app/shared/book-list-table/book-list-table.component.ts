import { Component, input } from '@angular/core';
import { TableComponent } from '../table/table.component';
import { TableColumnDef } from '../table/interface/table-column.interface';
import { Book } from './model/book.interface';
import { BookStatusPipe } from '../pipe/book-status.pipe';
import { BookStockColorPipe } from '../pipe/book-stock-color.pipe';
import { CommonModule } from '@angular/common';
import { BookStockPipe } from '../pipe/book-stock.pipe';

@Component({
  selector: 'app-book-list-table',
  standalone: true,
  imports: [
    CommonModule,
    TableComponent,
    BookStatusPipe,
    BookStockPipe,
    BookStockColorPipe,
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
      width: 120,
      sticky: true,
    },
    { name: 'bookTitle', title: '書名', columnType: 'template', width: 120 },
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
    { name: 'bookSize', title: '尺寸' },
    { name: 'bookPages', title: '頁數', columnType: 'number' },
    {
      name: 'estWeight',
      title: '*重量(g)',
      columnType: 'template',
      sort: true,
      width: 100,
    },
    {
      name: 'intlShipFee',
      title: '*國際運費(NTD)',
      columnType: 'template',
      sort: true,
      width: 120,
    },
    { name: 'count', title: '數量', hidden: false },
    { name: 'totalPrice', title: '總價格(日圓)', hidden: false, width: 80 },
    {
      name: 'totalEstWeight',
      title: '*總重量\r\n(g)',
      hidden: false,
      width: 80,
    },
    {
      name: 'totalIntlShipFee',
      title: '*總國際運費(NTD)',
      hidden: false,
      width: 120,
    },
  ];
}
