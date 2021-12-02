import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs';
import { FormType } from '../../../config/bq-start-config';
import { BaseFormView } from '../../core/base-form-view';
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
