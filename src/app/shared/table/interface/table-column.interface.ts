import { TemplateRef } from '@angular/core';

export interface TableColumnDef {
  name: string;
  title: string;
  width?: number;
  hidden?: boolean;
  sort?: boolean;
  headerType?: '' | 'template';
  columnType?: '' | 'template' | 'number';
  headerTemplateRef?: TemplateRef<unknown>;
  columnTemplateRef?: TemplateRef<unknown>;
}
