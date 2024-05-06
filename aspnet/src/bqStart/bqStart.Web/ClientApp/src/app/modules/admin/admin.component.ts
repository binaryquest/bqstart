import { Component, OnInit } from '@angular/core';
import { BaseComponent, MessageType } from 'projects/bq-start-prime/bq-start-module';
import { Department } from 'src/app/models/department';
import { SharedUtilityService } from '../shared/shared.service';

@Component({
  selector: 'admin-test',
  template: `
  <div>
    test local name {{local}}
  </div>

  <div>
    <button (click)="show()">Test</button>
  </div>
  <div>
    <button (click)="showDirect()">Test using direct</button>
  </div>
  `
})

export class AdminComponent extends BaseComponent {

  local:string;
  test:Department;

  constructor(private svc:SharedUtilityService) {
    super();
    this.local = this.i18("bq-start.messages.error");
   }

   show(){
    this.messageSvc.showMessage("test", "test", MessageType.info);
    this.svc.test();
   }

   showDirect(){
    this.messageSvc.showMessage("test", "test", MessageType.info);
   }
}
