import { Component, Inject, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import {
  AuthorizeService,
  LocaleService,
  BQConfigService,
  BQConfigData,
  KeyShortcutService,
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

  constructor(
    private primengConfig: PrimeNGConfig,
    private authorizeService: AuthorizeService,
    private localeService: LocaleService,
    private router: Router,
    private keySv: KeyShortcutService,
    @Inject(BQConfigService) private config: BQConfigData
  ) {
    this.localeService.initLocale('en-AU', 'en-US');
    this.tabbedInterface = this.config.tabbedUserInterface;
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.isAuthenticated = this.authorizeService.isAuthenticated();
    //tz.setDefault("Asia/Dhaka");
    this.keySv.addShortcut({ key: "f3", label: "New Department", description: "Create New Department Form"});
    this.keySv.keyPressed.subscribe(x => {
      if (Array.isArray(x)){
        if (x[0]==="f3"){
          this.router.navigate(['view/department-form/add/-1']);
        }
      }
    });
  }

  handleTopMenuClick(ev:any){
    console.log("handleTopMenuClick", ev);
    if (ev==="sidebar"){
      this.sidebarVisible = !this.sidebarVisible;
    }
  }
}
