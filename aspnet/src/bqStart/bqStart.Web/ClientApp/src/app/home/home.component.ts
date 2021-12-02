import { Component, OnInit } from '@angular/core';
import { AuthorizeService, IUser } from 'projects/bq-start-prime/src/public-api';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {

  public user: Observable<IUser|null>;
  public role: string | [] | undefined;

  constructor(private authorizeService: AuthorizeService){
    this.user = this.authorizeService.getUser();
    this.user.subscribe(x => this.role = x?.role);
  }


  ngOnInit(): void {

  }
}
