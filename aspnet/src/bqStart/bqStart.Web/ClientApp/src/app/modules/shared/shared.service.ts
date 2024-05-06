import { Injectable } from '@angular/core';
import { MessageService, MessageType } from 'projects/bq-start-prime/bq-start-module';


@Injectable({providedIn: 'root'})
export class SharedUtilityService {
  constructor(private msgSvc: MessageService) { }

  test(){
    this.msgSvc.showMessage("hello world", "test", MessageType.success);
  }
}
