import { Directive, Attribute, Input  } from '@angular/core';
import { Validator,  NG_VALIDATORS, AbstractControl, ValidationErrors } from '@angular/forms';

/**
 * This directive it used to compare values against two text fields
 *
 * @export
 * @class CompareDirective
 * @implements {Validator}
 */
@Directive({
  selector: '[compare]',
  providers: [{provide: NG_VALIDATORS, useExisting: CompareDirective, multi: true}]
})
export class CompareDirective implements Validator  {

  @Input('compare-to')
  public comparer: string;

  @Input('compare-parent')
  public compareParent: boolean | undefined | null;

  constructor() {
  }

  validate(c: AbstractControl): ValidationErrors | null {
    if (this.comparer === undefined || this.comparer === null){
      return null;
    }
    //console.log(`comapre here parent: (${this.isParent})`);
    const e = c.root.get(this.comparer);

    if (e && nz(c.value) !== nz(e.value) && !this.isParent) {
      return { compare: true };
    }

    if (e && nz(c.value) === nz(e.value)  && this.isParent) {
      setTimeout(() => {
        //console.log('clear error');
        if (e.errors!=null){
          delete e.errors['compare'];
        }
        e.setErrors(null);
        e.markAsUntouched();
        e.updateValueAndValidity();
      }, 100);
    }

    if (e && nz(c.value) !== nz(e.value) && this.isParent) {
      if (c.value === "" && e.value === null){
        e.setValue("");
      }
      setTimeout(() => {
        e.markAsDirty();
        e.markAsTouched();
        e.setErrors({ compare: true })
      }, 100);
    }
    //console.log('return null');
    return null;
  }

  private get isParent() {
    if (this.compareParent === undefined || this.compareParent === null) {
        return false;
    }
    return this.compareParent;
  }
}

function nz(val:any):any{
  if (val===null || val===undefined){
    return "";
  }
  return val;
}
