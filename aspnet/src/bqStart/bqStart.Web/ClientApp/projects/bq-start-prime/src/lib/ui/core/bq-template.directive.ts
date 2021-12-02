import { Directive, Input, TemplateRef } from "@angular/core";

@Directive({
  selector: '[bqTemplate]',
  host: {
  }
})
export class BQTemplate {

  @Input() type: string;

  @Input('bqTemplate') name: string;

  constructor(public template: TemplateRef<any>) {
    console.log("ctor bqtemplate");
  }

  getType(): string {
      return this.name;
  }
}
