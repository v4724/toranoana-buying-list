import { computed, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormGroup, FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class CalBoardService {
  formGroup = new FormGroup({
    exchangeRate: new FormControl(0.22),
    toranoanaFreight: new FormControl(295),
    intlFreight: new FormControl(180),
  });

  exchangeRateValueChanges = toSignal(
    this.formGroup.get('exchangeRate')!.valueChanges,
    { initialValue: 0.22 },
  );

  toranoanaFreightValueChanges = toSignal(
    this.formGroup.get('toranoanaFreight')!.valueChanges,
    { initialValue: 295 },
  );

  intlFreightValueChanges = toSignal(
    this.formGroup.get('intlFreight')!.valueChanges,
    { initialValue: 180 },
  );

  /** 每克 x 元 */
  intlFreightPerG = computed(() => {
    const val = this.intlFreightValueChanges();
    return val ? val / 1000 : 0;
  });

  constructor() {}
}
