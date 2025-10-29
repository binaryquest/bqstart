import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BqStartPrimeComponent } from './bq-start-prime.component';

describe('BqStartPrimeComponent', () => {
  let component: BqStartPrimeComponent;
  let fixture: ComponentFixture<BqStartPrimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BqStartPrimeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BqStartPrimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
