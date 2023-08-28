import { EventEmitter, Injectable } from '@angular/core';
import {ConfirmationService} from 'primeng/api';
import { Observable, Subject } from 'rxjs';

/**
 * Dialog Service for showing Confirm and Error Dialogs
 *
 * @export
 * @class DialogService
 */
@Injectable({providedIn: 'root'})
export class DialogService {
  constructor(private confirmationService: ConfirmationService) { }

  alertStore: Subject<{msg:string,heading:string}> = new Subject<{msg:string,heading:string}>();

  alert(msg:string, heading?:string){
    if (heading === null || heading === undefined){
      heading = "Confirmation";
    }
    this.alertStore.next({msg: msg, heading: heading});
  }

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
