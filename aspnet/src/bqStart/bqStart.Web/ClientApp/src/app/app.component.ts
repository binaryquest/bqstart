import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { AuthorizeService, LocaleService } from 'projects/bq-start-prime/src/public-api';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  title = 'bqStart';
  menuActive: boolean;
  public isAuthenticated: Observable<boolean>;

  constructor(private primengConfig: PrimeNGConfig, private authorizeService: AuthorizeService, private localeService: LocaleService) {
    this.localeService.initLocale('en-US', 'en-US');
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.isAuthenticated = this.authorizeService.isAuthenticated();
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
