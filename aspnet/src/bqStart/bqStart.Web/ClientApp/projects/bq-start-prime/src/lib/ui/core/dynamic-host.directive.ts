import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[dynHost]',
})
export class DynamicHostDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
