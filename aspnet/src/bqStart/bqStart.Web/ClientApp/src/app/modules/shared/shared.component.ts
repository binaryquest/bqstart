import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'shared-component',
  template: `
  <div>this is a shared component</div>
  `
})

export class SharedComponent implements OnInit {
  constructor() { }

  ngOnInit() { }
}
