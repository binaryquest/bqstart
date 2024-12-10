import { Component, Inject, OnInit } from '@angular/core';
//import { PrimeNGConfig } from 'primeng/api';
import {
  AuthorizeService,
  LocaleService,
  KeyShortcutService,
} from 'bq-start-prime';
import { BQConfigService, BQConfigData } from 'bq-start-core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { PrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {

  tabbedInterface: boolean;
  isAuthenticated: Observable<boolean>;
  sidebarVisible: boolean = false;

  smallInputFieldStyles = {
    handle: {
      borderRadius: '4px'
    },
    colorScheme: {
      light: {
        root: {
          paddingX: '0.5rem',
          paddingY: '0.25rem',
        }
      },
      dark: {
        root: {
          paddingX: '0.5rem',
          paddingY: '0.25rem',
        }
      }
    }
  };

  constructor(
    private primeng: PrimeNG,
    private authorizeService: AuthorizeService,
    private localeService: LocaleService,
    private router: Router,
    private keySv: KeyShortcutService,
    @Inject(BQConfigService) private config: BQConfigData
  ) {
    this.primeng.theme.set({
      preset: Aura,
      options: {
        darkModeSelector: '.my-app-dark',
        // cssLayer: {
        //   name: 'primeng',
        //   order: 'tailwind-base, primeng, tailwind-utilities'
        // }
      }
    })
    this.localeService.initLocale('en-AU', 'en-US');
    this.tabbedInterface = this.config.tabbedUserInterface;
  }

  ngOnInit(): void {
    //this.primengConfig.ripple = true;
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
