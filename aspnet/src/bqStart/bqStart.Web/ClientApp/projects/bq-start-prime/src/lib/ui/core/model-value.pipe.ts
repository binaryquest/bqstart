import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'modelValue'
})

export class ModelValuePipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return "hello:" + value;
  }

  private byString(o:any, s:any) {
    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, '');           // strip a leading dot
    var a = s.split('.');
    for (var i = 0, n = a.length; i < n; ++i) {
      var k = a[i];
      if (k in o) {
        o = o[k];
      } else {
        return;
      }
    }
    return o;
  }
}
