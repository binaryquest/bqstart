import { NgModule } from '@angular/core';


import { SharedUtilityService } from './shared.service';
import { SharedComponent } from './shared.component';
import { Checkbox } from 'primeng/checkbox';
import { RadioButton } from 'primeng/radiobutton';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';

@NgModule({
  imports: [
    RadioButton,
    NgSelectModule,
    NgOptionHighlightModule,
    SidebarModule,
    ButtonModule,
    Checkbox
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
