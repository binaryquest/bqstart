import { Component } from '@angular/core';
import { DialogService, MessageService, MessageType } from 'bq-start-prime';

@Component({
    selector: 'app-counter-component',
    templateUrl: './counter.component.html',
    standalone: false
})
export class CounterComponent {
  public currentCount = 0;

  constructor(private dialogSvc:DialogService, private messageSvc:MessageService){

  }

  public incrementCounter() {
    this.currentCount++;
    //this.dialogSvc.alert("Hello world", "Heading");
    this.messageSvc.showMessage("Hello world", "Heading", MessageType.info);
  }
}
