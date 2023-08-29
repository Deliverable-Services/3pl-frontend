import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreditTermsListComponent } from './credit-terms-list/credit-terms-list.component';
import { CreditTermsFormComponent } from './credit-terms-form/credit-terms-form.component';

const routes: Routes = [
  {
    path: "",
    component: CreditTermsListComponent,
  },
  {
    path: "add",
    component: CreditTermsFormComponent,
  },
  {
    path: "edit/:id",
    component: CreditTermsFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreditTermsRoutingModule { }
