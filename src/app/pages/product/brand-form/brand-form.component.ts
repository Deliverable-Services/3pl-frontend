import { Component } from '@angular/core';
import { AbstractControlDirective } from '@angular/forms';
import { DFormGroupRuleDirective, FormLayout } from 'ng-devui';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-brand-form',
  templateUrl: './brand-form.component.html',
  styleUrls: ['./brand-form.component.scss'],
})
export class BrandFormComponent {
  projectFormData = {
    brandName: '',
    brandCode: '',
    sessionName: '',
    sessionCode: '',
  };

  verticalLayout: FormLayout = FormLayout.Vertical;

  getValue(value: object) {
    console.log(value);
  }

  everyRange(range: any) {
    return range.every((_: any) => !!_);
  }

  submitProjectForm({ valid, directive, data, errors }: any) {
    console.log('projectFormData', this.projectFormData);
    if (valid) {
      // do something
    } else {
      // error tip
    }
  }
}
