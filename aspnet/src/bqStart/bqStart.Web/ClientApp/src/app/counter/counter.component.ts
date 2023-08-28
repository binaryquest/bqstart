import { Component } from '@angular/core';
import { DialogService } from 'projects/bq-start-prime/src/public-api';

@Component({
  selector: 'app-counter-component',
  templateUrl: './counter.component.html'
})
export class CounterComponent {
  public currentCount = 0;

  constructor(private dialogSvc:DialogService){

  }

  public incrementCounter() {
    this.currentCount++;
    this.dialogSvc.alert("Hello world", "Heading");
  }
}
