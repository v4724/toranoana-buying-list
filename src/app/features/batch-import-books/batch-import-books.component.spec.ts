import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchImportBooksComponent } from './batch-import-books.component';

describe('BatchImportBooksComponent', () => {
  let component: BatchImportBooksComponent;
  let fixture: ComponentFixture<BatchImportBooksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BatchImportBooksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BatchImportBooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
