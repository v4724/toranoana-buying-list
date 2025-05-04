import { Component, inject } from '@angular/core';
import { BookListTableComponent } from '../../shared/book-list-table/book-list-table.component';
import { Book } from '../../shared/book-list-table/model/book.interface';
import { BookStatus } from '../../shared/book-list-table/model/book-status.enum';
import { BookSize } from '../../shared/book-list-table/model/book-size.enum';
import { MatInputModule } from '@angular/material/input';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BookEstWeightPipe } from '../../shared/pipe/book-est-weight.pipe';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    BookListTableComponent,
  ],
  providers: [DecimalPipe],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {
  fetchUrlAPI = 'http://localhost:3000';
  // https://html-parser-backend-qtq8.onrender.com

  bookList: Book[] = [];

  url = new FormControl('https://ecs.toranoana.jp/joshi/ec/item/040031226821/');

  private http: HttpClient = inject(HttpClient);

  private decimalPipe: DecimalPipe = inject(DecimalPipe);

  constructor() {
    let books = 20;
    while (books-- > 0) {
      this.bookList.push({
        id: '',
        previewImg: '',
        url: '',
        bookTitle: `title-${books}`,
        price: 0,
        status: (books % 5).toString() as BookStatus,
        bookSize: books % 2 === 0 ? BookSize.A5 : BookSize.B5,
        bookPages: 0,
        estWeight: 0,
        intlShipFee: 0,
        count: 1,
        totalPrice: 0,
        totalEstWeight: 0,
        totalIntlShipFee: 0,
      });
    }
  }

  addToList() {
    const url = this.url.value;
    if (url) {
      this.fetchProductInfo(url).subscribe((book) => {
        const newList = [...this.bookList];
        newList.push(book);

        this.bookList = newList;
      });
    }
  }

  fetchProductInfo(url: string): Observable<Book> {
    const fetchUrl = `${this.fetchUrlAPI}/scrape?url=${url}`;
    return this.http
      .get(fetchUrl, { responseType: 'text' })
      .pipe(map((html: string) => this.parseHtml(html)));
  }

  private parseHtml(html: string): Book {
    const info = JSON.parse(html);
    let bookSize = info.bookSize as BookSize;
    if (bookSize.toString() === 'Ｂ５') {
      bookSize = BookSize.B5;
    } else if (bookSize.toString() === 'Ａ５') {
      bookSize = BookSize.A5;
    }

    const url: string = info.url;
    const bookPages: number = Number.parseInt(info.bookPages);
    const endWithSlash = url.endsWith('/');
    const urlArr = info.url.split('/');
    const id = endWithSlash ? urlArr[urlArr.length - 1] : urlArr[urlArr.length];

    const bookEstW = new BookEstWeightPipe();
    const estWeight = bookEstW.transform(bookPages, bookSize);

    return {
      id: id,
      previewImg: info.previewImg,
      url: url,
      bookTitle: info.bookTitle,
      price: Number.parseInt(info.price),
      status: info.status as BookStatus,
      bookSize: bookSize,
      bookPages: bookPages,
      estWeight: estWeight,
      count: 1,
      totalPrice: 0,
      totalEstWeight: 0,
      totalIntlShipFee: 0,
    } as Book;
  }
}
