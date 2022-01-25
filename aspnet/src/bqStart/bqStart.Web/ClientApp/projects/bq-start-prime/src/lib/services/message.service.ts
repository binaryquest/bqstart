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

  private channels:Channel[] = [];

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

  subscribeToChannel<T>(channelName:string, subscription: Subscription){
    let ch = this.channels.find(x => x.channelName == channelName);
    if (ch === undefined){
      ch = new Channel(channelName);
      this.channels.push(ch);
    }
    ch.addSubscription(subscription);
  }

  unSubscribeToChannel<T>(channelName:string, subscriptionId: string){
    let ch = this.channels.find(x => x.channelName == channelName);
    if (ch !== undefined){
      ch.removeSubscription(subscriptionId);
    }
  }

  postToChannel<T>(channelName:string, message: Message<T>){
    let ch = this.channels.find(x => x.channelName == channelName);
    if (ch !== undefined){
      ch.post(message);
    }
  }
}

class Channel{

  channelName: string;
  subscriptions: Subscription[] = [];

  constructor(name:string){
    this.channelName = name;
  }

  addSubscription(subscription: Subscription){
    let sub = this.subscriptions.find(x => x.id == subscription.id);
    if (sub === undefined){
      this.subscriptions.push(subscription);
    }
  }

  removeSubscription(id:string){
    let subIndex = this.subscriptions.findIndex(x => x.id == id);
    if (subIndex > -1){
      this.subscriptions.splice(subIndex, 1);
    }
  }

  post<T>(message:Message<T>){
    if (this.subscriptions.length>0){
      this.subscriptions.forEach(x => {
        try {
          setTimeout(() => x.callback(message.payload));
        } catch (error) {
        }
      });
    }
  }
}

export class Message<T>{
  payload: T;
}

export class Subscription{
  id: string;
  callback: (payload: any) => void;
}
