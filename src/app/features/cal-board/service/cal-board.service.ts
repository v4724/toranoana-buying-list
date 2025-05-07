import { computed, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormGroup, FormControl } from '@angular/forms';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CalBoardService {
  formGroup = new FormGroup({
    exchangeRate: new FormControl(0.22),
    toranoanaFreight: new FormControl(395),
    intlFreight: new FormControl(180),
  });

  exchangeRateValueChanges = toSignal(
    this.formGroup.get('exchangeRate')!.valueChanges.pipe(
      map((val) => {
        if (Number.isNaN(val)) {
          val = 0;
        } else {
          val = Number(val);
        }
        this.formGroup.get('exchangeRate')?.setValue(val, { emitEvent: false });
        return val;
      }),
    ),
    { initialValue: 0.22 },
  );

  toranoanaFreightValueChanges = toSignal(
    this.formGroup.get('toranoanaFreight')!.valueChanges.pipe(
      map((val) => {
        if (Number.isNaN(val)) {
          val = 0;
        } else {
          val = Number(val);
        }
        this.formGroup
          .get('toranoanaFreight')
          ?.setValue(val, { emitEvent: false });
        return val;
      }),
    ),
    { initialValue: 395 },
  );

  intlFreightValueChanges = toSignal(
    this.formGroup.get('intlFreight')!.valueChanges.pipe(
      map((val) => {
        if (Number.isNaN(val)) {
          val = 0;
        } else {
          val = Number(val);
        }
        this.formGroup.get('intlFreight')?.setValue(val, { emitEvent: false });
        return val;
      }),
    ),
    { initialValue: 180 },
  );

  /** 每克 x 元 */
  intlFreightPerG = computed(() => {
    const val = this.intlFreightValueChanges();
    return val ? val / 1000 : 0;
  });

  constructor() {}
}
