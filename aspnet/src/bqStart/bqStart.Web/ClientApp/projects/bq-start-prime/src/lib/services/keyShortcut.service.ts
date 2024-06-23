import { Injectable, Signal, WritableSignal, signal } from '@angular/core';
import { AllowIn, ShortcutInput } from 'ng-keyboard-shortcuts';
import { LogService } from './log/log.service';
import { Subject } from 'rxjs';
import { AppShortcutKey } from 'bq-start-core';


@Injectable({providedIn: 'root'})
export class KeyShortcutService {

  shortcuts: WritableSignal<ShortcutInput[]> = signal([]);
  keyPressed : Subject<string|string[]> = new Subject<string|string[]>();

  constructor(private logSvc:LogService) { }

  addShortcut(shortcut: AppShortcutKey){
    let current = this.shortcuts();
    if (!current.find(x => x.key == shortcut.key)){
      const si:ShortcutInput = {
        key: shortcut.key,
        label: shortcut.label,
        description: shortcut.description,
        preventDefault: true,
        allowIn: [AllowIn.Textarea, AllowIn.Input, AllowIn.Select],
        command: (e) => {
          this.keyPressed.next(e.key)
        }
      };
      this.shortcuts.update(values => { return [...values, si]; });
    }else{
      this.logSvc.warn("shortcut key already registered", shortcut);
    }
  }

  removeShortcut(key:string){
    this.shortcuts.update(values => {
      return values.filter(x => x.key !== key);
    });
  }
}
