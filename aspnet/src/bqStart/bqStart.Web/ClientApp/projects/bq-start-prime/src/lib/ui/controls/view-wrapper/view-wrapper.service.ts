import { Injectable } from '@angular/core';
import { BaseFormView } from '../../core/base-form-view';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({providedIn: 'root'})
export class ViewWrapperService {

  attachToView$ = new BehaviorSubject<BaseFormView<any>|null>(null);
  currentView?: BaseFormView<any>;

  constructor() { }

  public setupView(view: BaseFormView<any>){
    this.attachToView$.next(view);
    this.currentView = view;
  }
}
