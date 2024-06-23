import { NgModule } from '@angular/core';


import { SharedUtilityService } from './shared.service';
import { SharedComponent } from './shared.component';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { BQStartPrimeModule } from 'projects/bq-start-prime/bq-start-module';

@NgModule({
  imports: [CheckboxModule,
    RadioButtonModule,
    NgSelectModule,
    NgOptionHighlightModule,
    SidebarModule,
    ButtonModule,
  ],
  exports: [SharedComponent],
  declarations: [SharedComponent],
  providers: [SharedUtilityService],
})
export class SharedModule {
  constructor(){
    console.log("loading shared module");
  }
 }
