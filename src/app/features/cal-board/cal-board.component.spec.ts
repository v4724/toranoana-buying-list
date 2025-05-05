import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalBoardComponent } from './cal-board.component';

describe('CalBoardComponent', () => {
  let component: CalBoardComponent;
  let fixture: ComponentFixture<CalBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalBoardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
