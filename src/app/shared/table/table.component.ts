import {
  AfterViewInit,
  Component,
  computed,
  input,
  OnChanges,
  OnInit,
  Signal,
  SimpleChange,
  SimpleChanges,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { TableColumnDef } from './interface/table-column.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSortModule],
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

  ngOnInit(): void {
    this.dataSource.data = this.data();
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
}
