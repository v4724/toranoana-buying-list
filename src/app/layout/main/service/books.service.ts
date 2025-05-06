import { inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  EMPTY,
  finalize,
  map,
  Observable,
  Subject,
} from 'rxjs';
import { Book } from '../../../shared/book-list-table/model/book.interface';
import { BookStatus } from '../../../shared/book-list-table/model/book-status.enum';
import { BookStock } from '../../../shared/book-list-table/model/book-stock.enum';
import { BookSize } from '../../../shared/book-list-table/model/book-size.enum';
import { cloneDeep } from 'lodash-es';
import { HttpClient } from '@angular/common/http';
import { BookEstWeightPipe } from '../../../core/pipe/book-est-weight.pipe';
import { CalBoardService } from '../../../features/cal-board/service/cal-board.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  fetchUrlAPI = 'http://localhost:3000';
  // https://html-parser-backend-qtq8.onrender.com

  buyingList = new BehaviorSubject<Book[]>([]);

  wishList = new BehaviorSubject<Book[]>([]);

  calBoardService = inject(CalBoardService);

  buyingBookCntChange = new Subject<{
    book: Book;
    cnt: number;
    action: string;
  }>();

  buyingBookCntChange$ = toSignal(this.buyingBookCntChange);

  constructor(private http: HttpClient) {
    let bookList = [];
    let books = 20;
    while (books-- > 0) {
      bookList.push({
        id: '',
        previewImg: '',
        url: '',
        bookTitle: `title-${books}`,
        price: 0,
        status: (books % 3).toString() as BookStatus,
        stock: (books % 3).toString() as BookStock,
        bookSize: books % 2 === 0 ? BookSize.A5 : BookSize.B5,
        bookPages: 0,
        estWeight: 0,
        intlShipFee: 0,
        count: 1,
        totalPrice: 0,
        totalEstWeight: 0,
        totalIntlShipFee: 0,
        shippingSchedule: [
          {
            type: '毎度便',
            shippingDate: '2025/05/07',
          },
          {
            type: '定期便（週1)',
            shippingDate: '2025/05/07',
          },
          {
            type: '定期便（月2)',
            shippingDate: '2025/05/20',
          },
        ],
      });
    }
    const bookList2 = cloneDeep(bookList);

    this.buyingList.next(bookList);
    this.wishList.next(bookList2);
  }

  addToBuyingList(book: Book) {
    console.debug('fetch:', book);
    const wishList = this.wishList.value;
    const buyingList = this.buyingList.value;

    const findInBuyingList = buyingList.find((item) => item.id === book.id);
    const findInWishList = wishList.find((item) => item.id === book.id);
    if (findInBuyingList || findInWishList) {
      const text = findInBuyingList ? '購買清單' : '願望清單';
      window.alert(`重複加入「${text}」，若需要多本請調整該本數量。`);
      return;
    }

    buyingList.push(book);

    const newList = [...buyingList];
    this.buyingList.next(newList);
  }

  removeBook(book: Book) {
    const findInBuyingList = this.buyingList.value.findIndex(
      (item) => item.id === book.id,
    );
    if (findInBuyingList !== -1) {
      const list = [...this.buyingList.value];
      list.splice(findInBuyingList, 1);
      this.buyingList.next(list);
    }

    const findInWishList = this.wishList.value.findIndex(
      (item) => item.id === book.id,
    );
    if (findInWishList !== -1) {
      const list = [...this.wishList.value];
      list.splice(findInWishList, 1);
      this.wishList.next(list);
    }
  }

  /** 取得本子資訊 */
  fetchProductInfo$(url: string, alert: boolean = true): Observable<Book> {
    const fetchUrl = `${this.fetchUrlAPI}/scrape?url=${url}`;
    return this.http.get(fetchUrl, { responseType: 'text' }).pipe(
      map((html: string) => this.parseHtml(html)),
      catchError((err) => {
        console.error('取得本子資訊失敗', err);
        if (alert) {
          window.alert(`取得本子資訊失敗 ${err.stauts}: ${err.statusText}`);
        }
        throw err;
      }),
    );
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
    const id = endWithSlash
      ? urlArr[urlArr.length - 2]
      : urlArr[urlArr.length - 1];

    const bookEstW = new BookEstWeightPipe();
    const estWeight = bookEstW.transform(bookPages, bookSize);

    return {
      id: id,
      previewImg: info.previewImg,
      url: url,
      bookTitle: info.bookTitle,
      price: Number.parseInt(info.price),
      status: info.status as BookStatus,
      stock: info.stock as BookStock,
      shippingSchedule: info.shippingSchedule,
      bookSize: bookSize,
      bookPages: bookPages,
      estWeight: estWeight,
      count: 1,
      intlShipFee: estWeight * this.calBoardService.intlFreightPerG(),
      totalPrice: Number.parseInt(info.price),
      totalEstWeight: estWeight,
      totalIntlShipFee: estWeight * this.calBoardService.intlFreightPerG(),
    } as Book;
  }
}
