import { Component, Input, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { AuthorizeService } from '../../../api-authorization/authorize.service';
import { BQConfigService, BQConfigData } from '../../../config/bq-start-config';
import { AppInjector } from '../../../services/app-injector.service';
import { MainRegionAdapterService } from '../../../services/mainRegionAdapter.service';

@Component({
  selector: 'bq-app-layout',
  templateUrl: './app-layout.html',
  styleUrls: ['./app-layout.scss']
})
export class AppLayout implements OnInit {

  title = 'app';
  menuActive: boolean;
  showLeftMenu: boolean;
  isAuthenticated: boolean;

  @Input()
  showMenuOnTop: boolean = false;
  injector: any;
  config: BQConfigData;

  constructor(private primengConfig: PrimeNGConfig, private authorizeService: AuthorizeService) {
    this.authorizeService.isAuthenticated().subscribe(x => {
      this.showLeftMenu = x && !this.showMenuOnTop;
      this.isAuthenticated = x;
    });
    this.injector = AppInjector.getInjector();
    this.config = this.injector.get(BQConfigService);
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
  }

  onMenuButtonClick() {
    this.menuActive = true;
    this.addClass(document.body, 'blocked-scroll');
  }

  onMaskClick() {
    this.hideMenu();
  }

  hideMenu() {
    this.menuActive = false;
    this.removeClass(document.body, 'blocked-scroll');
  }

  addClass(element: any, className: string) {
    if (element.classList)
      element.classList.add(className);
    else
      element.className += ' ' + className;
  }

  removeClass(element: any, className: string) {
    if (element.classList)
      element.classList.remove(className);
    else
      element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
  }
}
