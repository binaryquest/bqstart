import { Directive } from '@angular/core';

import { controlContainerProvider } from './control-container.provider';

/**
 * Enable cross component form injection for template driven forms by default. Form controls
 * created with NgModel are implicitly included in the nearest FormGroup or NgModelGroup in the
 * template or component hierarchy. There is no additional configuration required.
 *
 * @see https://stackoverflow.com/questions/39242219
 */
@Directive({
  selector: '[ngModel],[ngModelGroup]',
  providers: [controlContainerProvider]
})
export class ControlContainerDirective { }
