import { Component, Inject, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import {
  AuthorizeService,
  LocaleService,
  BQConfigService,
  BQConfigData,
} from 'projects/bq-start-prime/src/public-api';
import { Observable } from 'rxjs';
import { tz } from 'moment-timezone';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {

  tabbedInterface: boolean;
  isAuthenticated: Observable<boolean>;

  constructor(
    private primengConfig: PrimeNGConfig,
    private authorizeService: AuthorizeService,
    private localeService: LocaleService,
    @Inject(BQConfigService) private config: BQConfigData
  ) {
    this.localeService.initLocale('en-AU', 'en-US');
    this.tabbedInterface = this.config.tabbedUserInterface;
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.isAuthenticated = this.authorizeService.isAuthenticated();
    //tz.setDefault("Asia/Dhaka");
  }
}
