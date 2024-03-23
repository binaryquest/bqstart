import { Component, Inject, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import {
  AuthorizeService,
  LocaleService,
  BQConfigService,
  BQConfigData,
} from 'projects/bq-start-prime/src/public-api';
import { Observable } from 'rxjs';
import { KeyboardShortcutsComponent, ShortcutInput } from 'ng-keyboard-shortcuts';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {

  tabbedInterface: boolean;
  isAuthenticated: Observable<boolean>;
  sidebarVisible: boolean = false;
  shortcuts: ShortcutInput[] = [];

  constructor(
    private primengConfig: PrimeNGConfig,
    private authorizeService: AuthorizeService,
    private localeService: LocaleService,
    private router: Router,
    @Inject(BQConfigService) private config: BQConfigData
  ) {
    this.localeService.initLocale('en-AU', 'en-US');
    this.tabbedInterface = this.config.tabbedUserInterface;
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.isAuthenticated = this.authorizeService.isAuthenticated();
    //tz.setDefault("Asia/Dhaka");
    this.shortcuts.push({
        key: "f3",
        label: "New Department",
        description: "Create New Department Form",
        command: (e) => {
          console.log('app f3');
          this.router.navigate(['view/department-form/add/-1']);
        },
        preventDefault: true
      });

  }

  handleTopMenuClick(ev:any){
    console.log("handleTopMenuClick", ev);
    if (ev==="sidebar"){
      this.sidebarVisible = !this.sidebarVisible;
    }
  }
}
