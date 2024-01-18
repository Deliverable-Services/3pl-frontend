import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerCodeListComponent } from './customer-code-list/customer-code-list.component';
import { CustomerCodeFormComponent } from './customer-code-form/customer-code-form.component';

const routes: Routes = [
  {
    path: "",
    component: CustomerCodeListComponent,
  },
  {
    path: "add",
    component: CustomerCodeFormComponent,
  },
  {
    path: "edit/:id",
    component: CustomerCodeFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerCodeRoutingModule { }
