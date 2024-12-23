import { Component, OnInit } from '@angular/core';
import { BaseComponent, MessageType } from 'bq-start-prime';
import { Department } from '../../models/department';
import { SharedUtilityService } from '../shared/shared.service';
import { ConfirmationService } from 'primeng/api';
@Component({
    selector: 'admin-test',
    template: `
  <div>
    test local name {{local}}
  </div>

  <div>
    <p-button (click)="show()">Test</p-button>
  </div>
  <br/>
  <div>
    <p-button (click)="showDirect()" severity="danger">Test using direct</p-button>
  </div>
  `,
    standalone: false
})

export class AdminComponent extends BaseComponent {

  local:string;
  test:Department;

  constructor(private svc:SharedUtilityService,
    private confirmationService: ConfirmationService,
  ) {
    super();
    this.local = this.i18("bq-start.messages.error");
   }

   show(){
    // this.messageSvc.showMessage("test", "test", MessageType.info);
    // this.svc.test();
    this.dialogService.confirm('test dialog message', 'Test Dialog', () => {
      console.log("test");
    });
   }

   showDirect(){
    //this.messageSvc.showMessage("test", "test", MessageType.info);
    this.confirmationService.confirm({
      message: 'test confirm message',
      header: 'Test Confirm',
      acceptLabel: 'OK-Custom',
      acceptIcon: 'pi pi-user',
      rejectIcon: 'pi pi-users',
      rejectLabel: 'Cancel-Custom',
      icon: 'pi pi-question-circle',
      accept: () => {
        console.log("test confirm");
      },
    });
   }
}
