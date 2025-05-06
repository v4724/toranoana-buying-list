import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateBookInfoComponent } from './update-book-info.component';

describe('UpdateBookInfoComponent', () => {
  let component: UpdateBookInfoComponent;
  let fixture: ComponentFixture<UpdateBookInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateBookInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateBookInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
