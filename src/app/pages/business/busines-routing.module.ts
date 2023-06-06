import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { VendorListComponent } from "./vendor/vendorList/vendor-list.component";
import { VendorFormComponent } from "./vendor/vendor-form/vendor-form.component";
import { CompanyListComponent } from "./company/companyList/company-list.component";
import { TradeTermListComponent } from "./trade-term/tradeTerm-List/tradeTerm-list.component";
import { TradeTermFormComponent } from "./trade-term/tradeTerm-form/tradeTerm-form.component";
import { CompanyFormComponent } from "./company/company-form/company-form.component";
import { DepartmentListComponent } from "./department/department-list/department-list.component";
import { DepartmentFormComponent } from "./department/department-form/department-form.component";
import { ExchangeRateListComponent } from "./exchange-rate/exchange-rate-list/exchange-rate-list.component";
import { ExchangeRateFormComponent } from "./exchange-rate/exchange-rate-form/exchange-rate-form.component";

const routes: Routes = [
  {
    path: "company",
    component: CompanyFormComponent,
  },
  {
    path: "department",
    component: DepartmentListComponent,
  },
  {
    path: "department/add",
    component: DepartmentFormComponent,
  },
  {
    path: "department/edit/:id",
    component: DepartmentFormComponent,
  },
  {
    path: "vendor",
    component: VendorListComponent,
  },

  {
    path: "vendor/add",
    component: VendorFormComponent,
  },
  {
    path: "vendor/edit/:id",
    component: VendorFormComponent,
  },
  {
    path: "trade-terms",
    component: TradeTermListComponent,
  },

  {
    path: "trade-terms/add",
    component: TradeTermFormComponent,
  },
  {
    path: "trade-terms/edit/:id",
    component: TradeTermFormComponent,
  },
  {
    path: "exchange-rate",
    component: ExchangeRateListComponent,
  },
  {
    path: "exchange-rate/add",
    component: ExchangeRateFormComponent,
  },
  {
    path: "exchange-rate/edit/:id",
    component: ExchangeRateFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductRoutingModule {}
