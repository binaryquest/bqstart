import { Pipe, PipeTransform } from '@angular/core';

/**
 * Converts a boolean value to yes/no string
 *
 * @export
 * @class BoolToYesNoPipe
 * @implements {PipeTransform}
 */
@Pipe({
  name: 'boolToYesNo'
})

export class BoolToYesNoPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    if (value){
      return "Yes";
    }else{
      return "No";
    }
  }
}

/**
 * Masks a password string to **** string
 *
 * @export
 * @class PasswordPipe
 * @implements {PipeTransform}
 */
@Pipe({
  name: 'password'
})
export class PasswordPipe implements PipeTransform {

  transform(value: string, replaceChar?: string): any {
    if (value === undefined || value === null) {
      return value;
    }
    // Replace with the specified character
    if (replaceChar) {
      return replaceChar.repeat(value.length);
    }
    // Replace value with asterisks
    return '*'.repeat(value.length);
  }
}
