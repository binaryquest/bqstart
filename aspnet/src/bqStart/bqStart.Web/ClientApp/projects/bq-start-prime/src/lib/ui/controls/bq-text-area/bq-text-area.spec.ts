import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BqTextArea } from './bq-text-area';

describe('BqTextAreaComponent', () => {
  let component: BqTextArea;
  let fixture: ComponentFixture<BqTextArea>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BqTextArea ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BqTextArea);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
