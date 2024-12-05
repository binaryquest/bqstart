import { Injectable } from '@angular/core';
import { MessageService, MessageType } from 'bq-start-prime';


@Injectable({providedIn: 'root'})
export class SharedUtilityService {
  constructor(private msgSvc: MessageService) { }

  test(){
    this.msgSvc.showMessage("hello world", "test", MessageType.success);
  }
}
