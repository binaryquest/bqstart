import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router, RouterEvent } from '@angular/router';
import { filter, map, Observable, Observer, switchMap } from 'rxjs';
import { FormType, MenuData, ViewData, RouteData } from '../../../config/bq-start-config';
import { BaseComponent } from '../../base.component';

@Component({
  selector: 'breadcrumb',
  templateUrl: './breadcrumb.html',
  styleUrls: ['./breadcrumb.scss']
})
export class Breadcrumb extends BaseComponent implements OnInit {

  routeData$: Observable<any>;
  viewDef: ViewData | null;
  formType: FormType | null;
  title: String;
  showSelf: boolean = false;
  menuStack:MenuData[] = [];

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,) {
    super();

    this.routeData$ = router.events.pipe(
      filter(routeEvent => routeEvent instanceof NavigationEnd),
      map(() => activatedRoute),
      map(activatedRoute => activatedRoute.firstChild),
      switchMap(firstChild => {
        if (firstChild!=null){
          return firstChild.data;
        }else{
          return <any>{};
        }
      }),
      map((data) => data)
      );

      this.routeData$.subscribe({
      next: (e) => {

        console.log("route chaning");

        if (e!=null && e.viewDef!=null){
          this.viewDef = e.viewDef;
          this.title = e.viewDef.title;
          if (this.viewDef?.hideBreadCrumb != null){
            this.showSelf = !this.viewDef?.hideBreadCrumb;
          }else{
            this.showSelf = true; //by default we show it
          }
          this.menuStack = [];
          const foundInMenu = this.recurseFindViewIdInMenu(this.config.menus, this.viewDef?.viewId);
          this.menuStack.pop();
        }else{
          this.viewDef = null;
          this.title = "";
          this.showSelf = false;
        }

      },
      error: (e) => {},
      complete: () => {}
    });
  }

  ngOnInit(): void {
  }

  goBack(){
    this.navigationService.back();
  }

  private recurseFindViewIdInMenu(menus: MenuData[], viewId: string|undefined):boolean{
    if (menus === undefined || menus === null || viewId === undefined){
      return false;
    }
    for (let i = 0; i < menus.length; i++) {
      const aMenu = menus[i];
      this.menuStack.push(aMenu);
      if (aMenu.viewId != null){
        if (aMenu.viewId == viewId){
          return true;
        }
      }
      if (aMenu.childMenus){
        const childFound = this.recurseFindViewIdInMenu(aMenu.childMenus, viewId);
        if (childFound){
          return true;
        }
      }
    }
    this.menuStack.pop();
    return false;
  }

}
