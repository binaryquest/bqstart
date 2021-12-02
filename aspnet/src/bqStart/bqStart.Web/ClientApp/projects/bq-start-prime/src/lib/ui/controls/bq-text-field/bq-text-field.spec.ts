import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BqTextField } from './bq-text-field';

describe('BqTextFieldComponent', () => {
  let component: BqTextField;
  let fixture: ComponentFixture<BqTextField>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BqTextField ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BqTextField);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
