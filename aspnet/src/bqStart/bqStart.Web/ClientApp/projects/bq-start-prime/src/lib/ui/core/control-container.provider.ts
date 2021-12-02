import { Component, Host, Optional, SkipSelf } from '@angular/core';
import { ControlContainer } from '@angular/forms';

export const containerFactory = (container: ControlContainer) => {
  return container
};

/**
 * Enable cross component form injection for a directive.
 */
export const controlContainerProvider = [{
  provide: ControlContainer,
  deps: [[new Optional(), new SkipSelf(), ControlContainer]],
  useFactory: containerFactory
}]
