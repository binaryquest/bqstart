import {Component,ElementRef,Input,Output,EventEmitter,AfterContentInit,ContentChildren,QueryList,TemplateRef,forwardRef,ViewChild,ChangeDetectionStrategy, ViewEncapsulation, ChangeDetectorRef, Pipe, Injectable, PipeTransform, OnInit} from '@angular/core';
import {PrimeTemplate} from 'primeng/api';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from '@angular/forms';
import { TableFilter } from '../bq-table/bq-table-filter';

export const CHIPS_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ChipsMenu),
  multi: true
};

@Component({
    selector: 'bq-chips-menu',
    templateUrl: './bq-chips-menu.html',
    host: {
        '[class.p-inputwrapper-filled]': 'filled',
        '[class.p-inputwrapper-focus]': 'focus'
    },
    providers: [CHIPS_VALUE_ACCESSOR],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./bq-chips-menu.css']
})
export class ChipsMenu implements AfterContentInit,ControlValueAccessor, OnInit {

    @Input() style: any;

    @Input() styleClass: string;

    @Input() disabled: boolean;

    @Input() field: string;

    @Input() placeholder: string;

    @Input() max: number;

    @Input() ariaLabelledBy: string;

    @Input() tabindex: number;

    @Input() inputId: string;

    @Input() allowDuplicate: boolean = true;

    @Input() inputStyle: any;

    @Input() inputStyleClass: any;

    @Input() addOnTab: boolean;

    @Input() addOnBlur: boolean;

    @Input() separator: string;

    @Output() onAdd: EventEmitter<any> = new EventEmitter();

    @Output() onRemove: EventEmitter<any> = new EventEmitter();

    @Output() onFocus: EventEmitter<any> = new EventEmitter();

    @Output() onBlur: EventEmitter<any> = new EventEmitter();

    @Output() onChipClick: EventEmitter<any> = new EventEmitter();

    @ViewChild('inputtext') inputViewChild: ElementRef;

    @ContentChildren(PrimeTemplate) templates: QueryList<any>;

    public itemTemplate: TemplateRef<any>;

    value: any;

    onModelChange: Function = () => {};

    onModelTouched: Function = () => {};

    valueChanged: boolean;

    focus: boolean;

    filled: boolean;

    //BQ related
    menuVisible: boolean;
    typedText: string;
    @Input()
    filters: QueryList<TableFilter>;

    defaultFilters: TableFilter[];

    selectedFilter: TableFilter;
    selectedFilterIndex: number = -1;

    constructor(public el: ElementRef, public cd: ChangeDetectorRef) {}

    ngOnInit(): void {
      this.defaultFilters = this.filters.filter(ff => ff.defaultSearchField);
      if (this.defaultFilters.length>0){
        this.selectedFilter = this.defaultFilters[0];
        this.selectedFilterIndex = 0;
      }
    }

    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch(item.getType()) {
                case 'item':
                    this.itemTemplate = item.template;
                break;

                default:
                    this.itemTemplate = item.template;
                break;
            }
        });
    }

    onClick() {
        this.inputViewChild.nativeElement.focus();
    }

    onInput() {
        this.updateFilledState();
    }

    onPaste(event:any) {
        if (this.separator) {
            let pastedData = (event.clipboardData || (window as { [key: string]: any })['clipboardData']).getData('Text');
            pastedData.split(this.separator).forEach((val:any) => {
                this.addItem(event, val, true);
            });
            this.inputViewChild.nativeElement.value = '';
        }
        this.updateFilledState();
    }

    updateFilledState() {
        if (!this.value || this.value.length === 0) {
            this.filled = (this.inputViewChild.nativeElement && this.inputViewChild.nativeElement.value != '');
        }
        else {
            this.filled = true;
        }
    }

    onItemClick(event: Event, item: any) {
        this.onChipClick.emit({
            originalEvent: event,
            value: item
        });
    }

    writeValue(value: any) : void {
        this.value = value;
        this.updateMaxedOut();
        this.cd.markForCheck();
    }

    registerOnChange(fn: Function): void {
        this.onModelChange = fn;
    }

    registerOnTouched(fn: Function): void {
        this.onModelTouched = fn;
    }

    setDisabledState(val: boolean): void {
        this.disabled = val;
        this.cd.markForCheck();
    }

    resolveFieldData(data: any, field: string): any {
        if (data && field) {
            if (field.indexOf('.') == -1) {
                return data[field];
            }
            else {
                let fields: string[] = field.split('.');
                let value = data;
                for(var i = 0, len = fields.length; i < len; ++i) {
                    value = value[fields[i]];
                }
                return value;
            }
        }
        else {
            return null;
        }
    }

    onInputFocus(event: FocusEvent) {
        this.focus = true;
        this.onFocus.emit(event);
    }

    onInputBlur(event: FocusEvent) {
        this.focus = false;
        if (this.addOnBlur && this.inputViewChild.nativeElement.value) {
            this.addItem(event, this.inputViewChild.nativeElement.value, false);
        }
        this.onModelTouched();
        this.onBlur.emit(event);
    }

    removeItem(event: Event, index: number): void {
        if (this.disabled) {
            return;
        }

        let removedItem = this.value[index];
        this.value = this.value.filter((val:any, i:number) => i!=index);
        this.onModelChange(this.value);
        this.onRemove.emit({
            originalEvent: event,
            value: removedItem
        });
        this.updateFilledState();
        this.updateMaxedOut();
    }

    addItem(event: Event, item: string, preventDefault: boolean): void {
        this.value = this.value||[];
        if (item && item.trim().length) {
            if (this.allowDuplicate || this.value.indexOf(item) === -1) {
                this.value = [...this.value, item];
                this.onModelChange(this.value);
                this.onAdd.emit({
                    originalEvent: event,
                    value: item,
                    selectedFilter: this.selectedFilter
                });
                this.typedText = "";
                this.menuVisible = false;
            }
        }
        this.updateFilledState();
        this.updateMaxedOut();
        this.inputViewChild.nativeElement.value = '';

        if (preventDefault) {
            event.preventDefault();
        }
    }

    onKeydown(event: KeyboardEvent): void {
        switch(event.which) {
            //backspace
            case 8:
                if (this.inputViewChild.nativeElement.value.length === 0 && this.value && this.value.length > 0) {
                    this.value = [...this.value];
                    let removedItem = this.value.pop();
                    this.onModelChange(this.value);
                    this.onRemove.emit({
                        originalEvent: event,
                        value: removedItem
                    });
                    this.updateFilledState();
                }
            break;

            //enter
            case 13:
                this.addItem(event, this.inputViewChild.nativeElement.value, true);
            break;

            case 9:
                if (this.addOnTab && this.inputViewChild.nativeElement.value !== '') {
                    this.addItem(event, this.inputViewChild.nativeElement.value, true);
                }
            break;

            case 40: //down arrow
                if (this.menuVisible){
                  if (this.defaultFilters.length>0){
                    this.selectedFilterIndex++;
                    if (this.selectedFilterIndex>(this.defaultFilters.length-1)){
                      this.selectedFilterIndex = 0;
                    }
                    this.selectedFilter = this.defaultFilters[this.selectedFilterIndex];
                  }
                  event.preventDefault();
                }
            break;
            case 38: //up arrow
                if (this.menuVisible){
                  if (this.defaultFilters.length>0){
                    this.selectedFilterIndex--;
                    if (this.selectedFilterIndex < 0){
                      this.selectedFilterIndex = this.defaultFilters.length - 1;
                    }
                    this.selectedFilter = this.defaultFilters[this.selectedFilterIndex];
                  }
                  event.preventDefault();
                }
            break;

            default:
                if (this.max && this.value && this.max === this.value.length) {
                    event.preventDefault();
                }
                else if (this.separator) {
                    if (this.separator === ',' && event.which === 188) {
                        this.addItem(event, this.inputViewChild.nativeElement.value, true);
                    }
                }
            break;
        }
    }

    updateMaxedOut() {
        if (this.inputViewChild && this.inputViewChild.nativeElement) {
            if (this.max && this.value && this.max === this.value.length)
                this.inputViewChild.nativeElement.disabled = true;
            else
                this.inputViewChild.nativeElement.disabled = this.disabled || false;
        }
    }

    inputChanged(value:any){
      this.menuVisible = (value !== "");
    }

    menuClicked(filter:TableFilter, event:MouseEvent){
      this.selectedFilter = filter;
      this.addItem(event, this.inputViewChild.nativeElement.value, true);
    }
}
