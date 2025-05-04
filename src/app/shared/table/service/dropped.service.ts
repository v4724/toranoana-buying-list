import { CdkDropList } from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DroppedService {
  dropped = new Subject<CdkDropList>();

  constructor() {}
}
