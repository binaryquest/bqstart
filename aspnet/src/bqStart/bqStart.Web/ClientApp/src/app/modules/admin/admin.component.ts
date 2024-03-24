import { Component, OnInit } from '@angular/core';
import { BaseComponent } from 'projects/bq-start-prime/bq-start-module';
import { Department } from 'src/app/models/department';

@Component({
  selector: 'admin-test',
  template: `
  <div>
    test local name {{local}}
  </div>
  `
})

export class AdminComponent extends BaseComponent {

  local:string;
  test:Department;

  constructor() {
    super();
    this.local = this.i18("bq-start.messages.error");
   }

}
