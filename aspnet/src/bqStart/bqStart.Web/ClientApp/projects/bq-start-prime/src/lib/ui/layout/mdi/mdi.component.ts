import { Component, OnInit } from '@angular/core';
import { MainRegionAdapterService } from '../../../services/mainRegionAdapter.service';
import { ViewWrapperService } from '../../controls/view-wrapper/view-wrapper.service';

/**
 * This document is responsible for showing a view inside a tab in tabbed MDI view
 *
 * @export
 * @class MDIComponent
 */
@Component({
  selector: 'bq-mdi',
  template: `
<p-tabView class="flex-grow-1 flex flex-column" [(activeIndex)]="regionSvc.activeIndex"
          (onClose)="handleClose($event)" (activeIndex)="handleTabChange()"
          [controlClose]="true"
          >
  <p-tabPanel *ngFor="let item of regionSvc.currentStack;let i = index"
          [closable]="true" [selected]="i == regionSvc.activeIndex">
          <ng-template pTemplate="header">
            <span>{{item.viewDef.title}}</span>&nbsp;
          </ng-template>
    <dyn-mdi-loader [viewRunningData]="item"></dyn-mdi-loader>
  </p-tabPanel>
</p-tabView>
`
})

export class MDIComponent {

  constructor(public regionSvc:MainRegionAdapterService) { }

  handleClose(e:any){
    //e.close();
    this.regionSvc.removeFromView(e.index);
  }

  handleTabChange(){

  }
}
