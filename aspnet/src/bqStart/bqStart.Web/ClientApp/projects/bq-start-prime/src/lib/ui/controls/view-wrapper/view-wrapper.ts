import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { ViewWrapperService } from './view-wrapper.service';

@Component({
  selector: 'view-wrapper',
  templateUrl: './view-wrapper.html',
  styleUrls: ['./view-wrapper.scss']
})
export class ViewWrapper implements OnInit {

  constructor(private vwService: ViewWrapperService) {

  }

  ngOnInit(): void {

  }

}
