import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { InvoiceManagementListComponent } from "./invoice-management-list/invoice-management-list.component";
import { InvoiceManagementFormComponent } from "./invoice-management-form/invoice-management-form.component";

const routes: Routes = [
  {
    path: "",
    component: InvoiceManagementListComponent,
  },
  {
    path: "add",
    component: InvoiceManagementFormComponent,
  },
  {
    path: "edit/:id",
    component: InvoiceManagementFormComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvoiceManagementRoutingModule {}
