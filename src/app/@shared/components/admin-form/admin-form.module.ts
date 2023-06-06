import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminFormComponent } from './admin-form.component';
import { ButtonModule, DatepickerModule, FormModule, SelectModule } from 'ng-devui';
import { FormsModule } from '@angular/forms';
import { CheckBoxModule } from 'ng-devui';

@NgModule({
  imports: [CommonModule, FormModule, DatepickerModule, FormsModule, SelectModule, ButtonModule, CheckBoxModule],
  declarations: [AdminFormComponent],
  exports: [AdminFormComponent],
})
export class AdminFormModule {}
