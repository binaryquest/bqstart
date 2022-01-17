import { Injectable } from '@angular/core';
import { MessageService as PrimeMS } from 'primeng/api';

export enum MessageType {
  info = 0,
  warn = 1,
  success = 2,
  error = 3
}

/**
 * This service is responsible for showing warning messages in the UI using primeNG
 *
 * @export
 * @class MessageService
 */
@Injectable({ providedIn: 'root' })
export class MessageService {
  constructor(private messageServiceProvider: PrimeMS) { }

  showMessage(msg: string, title: string, type: MessageType) {
    let severity: string = "";
    switch (type) {
      case MessageType.info:
        severity = "info";
        break;
      case MessageType.success:
        severity = "success";
        break;
      case MessageType.warn:
        severity = "warn";
        break;
      case MessageType.error:
        severity = "error";
        break;
    }
    this.messageServiceProvider.add({severity: severity, summary: title, detail: msg});
  }
}
