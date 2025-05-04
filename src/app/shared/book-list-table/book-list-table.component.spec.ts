import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookListTableComponent } from './book-list-table.component';

describe('BookListTableComponent', () => {
  let component: BookListTableComponent;
  let fixture: ComponentFixture<BookListTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookListTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookListTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
