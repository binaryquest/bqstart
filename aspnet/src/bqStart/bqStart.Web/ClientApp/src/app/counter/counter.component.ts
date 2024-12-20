import { Component } from '@angular/core';
import { DialogService } from 'bq-start-prime';

@Component({
    selector: 'app-counter-component',
    templateUrl: './counter.component.html',
    standalone: false
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
