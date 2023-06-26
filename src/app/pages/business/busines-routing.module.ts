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
import { CurrencyListComponent } from "./currency/currency-list/currency-list.component";
import { CurrencyFormComponent } from "./currency/currency-form/currency-form.component";
import { ShopifyConnectorListComponent } from "./shopify-connector/shopify-connector-list/shopify-connector-list.component";
import { ShopifyConnectorFormComponent } from "./shopify-connector/shopify-connector-form/shopify-connector-form.component";

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
    path: "currency",
    component: CurrencyListComponent,
  },
  {
    path: "currency/add",
    component: CurrencyFormComponent,
  },
  {
    path: "currency/edit/:id",
    component: CurrencyFormComponent,
  },
  {
    path: "shopify-connector",
    component: ShopifyConnectorListComponent,
  },
  {
    path: "shopify-connector/add",
    component: ShopifyConnectorFormComponent,
  },
  {
    path: "shopify-connector/edit/:id",
    component: ShopifyConnectorFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductRoutingModule {}
