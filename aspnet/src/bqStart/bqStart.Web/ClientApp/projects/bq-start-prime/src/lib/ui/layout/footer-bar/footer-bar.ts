import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../base.component';

@Component({
  selector: 'bq-footer-bar',
  templateUrl: './footer-bar.html',
  styleUrls: ['./footer-bar.scss']
})
export class FooterBar extends BaseComponent implements OnInit {

  applicationName: string;
  copyright: string;
  year: number;

  constructor() {
    super();
    this.applicationName = this.config.applicationName ?? "BQ Admin";
    this.copyright = this.config.companyName ?? "BQ";
    this.year = new Date().getFullYear();
  }

  ngOnInit(): void {
  }

}
