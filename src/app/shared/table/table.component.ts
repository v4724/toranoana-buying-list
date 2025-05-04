import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  OnChanges,
  OnInit,
  output,
  Signal,
  SimpleChanges,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { TableColumnDef } from './interface/table-column.interface';
import { CommonModule } from '@angular/common';
import {
  CdkDragDrop,
  CdkDropList,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { DroppedService } from './service/dropped.service';
import { filter, takeUntil } from 'rxjs';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSortModule, DragDropModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent<T> implements OnInit, OnChanges, AfterViewInit {
  columns = input<TableColumnDef[]>([]);

  data = input<T[]>([]);

  headerTemplates = input<{ [key: string]: TemplateRef<unknown> }>({});

  columnTemplates = input<{ [key: string]: TemplateRef<unknown> }>({});

  sort = viewChild(MatSort);

  columnDefs = computed(() => {
    const defs = this.columns();
    const headerTemplates = this.headerTemplates();
    const columnTemplates = this.columnTemplates();
    defs
      .filter((def) => def.headerType === 'template')
      .forEach((def) => (def.headerTemplateRef = headerTemplates[def.name]));
    defs
      .filter((def) => def.columnType === 'template')
      .forEach((def) => (def.columnTemplateRef = columnTemplates[def.name]));

    return defs;
  });

  displayedColumns: Signal<string[]> = computed(() => {
    return this.columns()
      .filter((def) => !def.hidden)
      .map((def) => def.name);
  });

  dataSource = new MatTableDataSource<T>([]);

  private cdkDropList = viewChild(CdkDropList);

  private droppedService = inject(DroppedService);

  ngOnInit(): void {
    this.dataSource.data = this.data();

    this.droppedService.dropped
      .pipe(
        filter((container) => {
          return this.cdkDropList() === container;
        }),
      )
      .subscribe(() => {
        this.dataSource._updateChangeSubscription?.(); // 通知 table 資料有異動
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.dataSource.data = this.data();
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort() || null;
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
    } else {
    }
  }

  drop(event: CdkDragDrop<any[]>) {
    const prevData = event.previousContainer.data;
    const currData = event.container.data;

    if (!prevData || !currData) {
      console.warn('Drop failed: data undefined', event);
      return;
    }

    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      this.droppedService.dropped.next(event.previousContainer);
    }
    this.dataSource._updateChangeSubscription?.(); // 通知 table 資料有異動
  }
}
