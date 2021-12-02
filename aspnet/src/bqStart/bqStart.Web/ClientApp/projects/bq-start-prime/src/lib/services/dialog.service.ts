import { EventEmitter, Injectable } from '@angular/core';
import {ConfirmationService} from 'primeng/api';
import {DialogModule} from 'primeng/dialog';
@Injectable({providedIn: 'root'})
export class DialogService {
  constructor(private confirmationService: ConfirmationService) { }

  confirm(msg:string, heading?:string, accept?:Function, cancel?:Function ){

    if (heading === null || heading === undefined){
      heading = "Confirmation";
    }

    this.confirmationService.confirm({
      message: msg,
      header: heading,
      icon: 'pi pi-exclamation-triangle',
      accept: accept,
      reject: cancel
    });
  }

  errorDialog(msg:string, heading?:string){

    if (heading === null || heading === undefined){
      heading = "Message";
    }

    this.confirmationService.confirm({
      message: msg,
      header: heading,
      acceptVisible: false,
      rejectLabel: "Ok",
      rejectButtonStyleClass: "p-button-warning",
      icon: 'pi pi-exclamation-triangle'
    });
  }
}
