import { Component, OnInit } from '@angular/core';
import { MainRegionAdapterService } from '../../../services/mainRegionAdapter.service';

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
          (onClose)="handleClose($event)"
          [controlClose]="true"
          >
  <p-tabPanel *ngFor="let item of regionSvc.currentStack;let i = index"
          [header]="item.viewDef.title"
          [leftIcon]="item.icon"
          [closable]="true" [selected]="i == regionSvc.activeIndex">
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
}
