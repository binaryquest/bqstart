import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { BqForm } from '../bq-form/bq-form';

@Component({
  selector: 'bq-form-block',
  templateUrl: './form-block.html',
  styleUrls: ['./form-block.scss'],
  providers: [
    {
      provide: ControlContainer,
      useFactory: (comp:any) => <any>comp.form,
      deps: [BqForm]
    }
  ],
})
export class FormBlock implements OnInit {

  @Input()
  labelSize: number = 3;

  constructor() { }

  ngOnInit(): void {

  }


}
