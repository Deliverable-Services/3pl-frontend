import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormLayout } from 'ng-devui';
import { FormConfig } from './admin-form.type';

@Component({
  selector: 'da-admin-form',
  templateUrl: './admin-form.component.html',
  styleUrls: ['./admin-form.component.scss'],
})
export class AdminFormComponent implements OnInit {
  @Input() formConfig: FormConfig = {
    layout: FormLayout.Horizontal,
    labelSize: 'sm',
    items: [],
  };

  _formData: any = {};

  @Input() set formData(val: any) {
    console.log(val);
    this._formData = JSON.parse(JSON.stringify(val));
  }
  
  @Output() submitted = new EventEmitter();
  @Output() canceled = new EventEmitter();
  @Output() checked = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  submitPlanForm({ valid }: { valid: boolean }) {
    if (valid) {
      this.submitted.emit(this._formData);
    }
  }

  onCheck(e: any) {
    console.log('dfdgfd');
    this.checked.emit();
  }

  cancel() {
    this.canceled.emit();
  }

  // preventSpace(e: any, key: string) {
  //   console
  //   if(['Space'].includes(arguments[0].code) ){return false;}
  // } // preventSpace(e: any, key: string) {
  //   console
  //   if(['Space'].includes(arguments[0].code) ){return false;}
  // }
}
