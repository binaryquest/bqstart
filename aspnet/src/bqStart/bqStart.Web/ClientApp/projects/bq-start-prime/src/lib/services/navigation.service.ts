import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { AppInitService } from './app-init.service';
import { MainRegionAdapterService } from './mainRegionAdapter.service';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private history: string[] = [];

  constructor(
    private router: Router,
    private location: Location,
    private appInitService: AppInitService,
    private regionSvc: MainRegionAdapterService
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.history.push(event.urlAfterRedirects);
      }
    });
  }

  back(skipCanClose:boolean = false): void {
    if (this.appInitService.runningConfig.tabbedUserInterface) {
      this.regionSvc.removeCurrentView(skipCanClose);
    } else {
      this.history.pop();
      if (this.history.length > 0) {
        this.location.back();
      } else {
        this.router.navigateByUrl('/');
      }
    }
  }
}
