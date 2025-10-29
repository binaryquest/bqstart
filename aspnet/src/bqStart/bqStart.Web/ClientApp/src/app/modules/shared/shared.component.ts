import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'shared-component',
    template: `
  <div>this is a shared component</div>
  `,
    standalone: false
})

export class SharedComponent implements OnInit {
  constructor() { }

  ngOnInit() { }
}
