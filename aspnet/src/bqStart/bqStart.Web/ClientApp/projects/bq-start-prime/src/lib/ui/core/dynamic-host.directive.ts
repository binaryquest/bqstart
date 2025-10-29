import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[dynHost]',
    standalone: false
})
export class DynamicHostDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
