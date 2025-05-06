import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAllBooksInfoComponent } from './update-all-books-info.component';

describe('UpdateAllBooksInfoComponent', () => {
  let component: UpdateAllBooksInfoComponent;
  let fixture: ComponentFixture<UpdateAllBooksInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateAllBooksInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateAllBooksInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
