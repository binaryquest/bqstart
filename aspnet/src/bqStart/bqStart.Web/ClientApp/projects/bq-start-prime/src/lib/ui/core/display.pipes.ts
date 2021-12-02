import { Pipe, PipeTransform } from '@angular/core';

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
