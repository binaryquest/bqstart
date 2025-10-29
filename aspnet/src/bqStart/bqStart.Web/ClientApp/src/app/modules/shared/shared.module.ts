import { ModuleWithProviders, NgModule } from '@angular/core';


import { SharedUtilityService } from './shared.service';
import { SharedComponent } from './shared.component';
import { Checkbox } from 'primeng/checkbox';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BQStartPrimeModule } from 'bq-start-prime';

@NgModule({
  imports: [
    NgSelectModule,
    NgOptionHighlightModule,
    SidebarModule,
    Checkbox,
    ButtonModule,
  ],
  exports: [SharedComponent],
  declarations: [SharedComponent],
  providers: [MessageService],
})
export class SharedModule {
  constructor(){
    console.log("loading shared module");
  }
 }
