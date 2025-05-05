import { BookSize } from './book-size.enum';
import { BookStatus } from './book-status.enum';
import { BookStock } from './book-stock.enum';

export interface Book {
  /** Id */
  id: string;

  /** 網址 */
  url: string;

  /** 預覽圖 */
  previewImg: string;

  /** 書名 */
  bookTitle: string;

  /** 價格(日圓) */
  price: number;

  /** 狀態 */
  status: BookStatus;

  /** 庫存 */
  stock: BookStock;

  /** 尺寸 */
  bookSize: BookSize;

  /** 頁數 */
  bookPages: number;

  /** 重量(g) */
  estWeight: number;

  /** 國際運費(NT$) */
  intlShipFee?: number;

  /** 數量 */
  count: number;

  /** 總價格(日圓) */
  totalPrice: number;

  /** 總重量 */
  totalEstWeight: number;

  /** 總國際運費(NT$) */
  totalIntlShipFee: number;
}
