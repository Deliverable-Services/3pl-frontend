import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ProductRoutingModule } from "./busines-routing.module";
import { FormsModule } from "@angular/forms";
import {
  PaginationModule,
  InputNumberModule,
  DatepickerModule,
  TooltipModule,
} from "ng-devui";
import { AdminFormModule } from "src/app/@shared/components/admin-form";
import { SharedModule } from "src/app/@shared/shared.module";
import { VendorFormComponent } from "./vendor/vendor-form/vendor-form.component";
import { VendorListComponent } from "./vendor/vendorList/vendor-list.component";
import { CompanyListComponent } from "./company/companyList/company-list.component";
import { TradeTermListComponent } from "./trade-term/tradeTerm-List/tradeTerm-list.component";
import { TradeTermFormComponent } from "./trade-term/tradeTerm-form/tradeTerm-form.component";
import { DepartmentFormComponent } from './department/department-form/department-form.component';
import { DepartmentListComponent } from './department/department-list/department-list.component';
import { CompanyFormComponent } from './company/company-form/company-form.component';
import { CurrencyFormComponent } from './currency/currency-form/currency-form.component';
import { CurrencyListComponent } from './currency/currency-list/currency-list.component';
import { ShopifyConnectorListComponent } from "./shopify-connector/shopify-connector-list/shopify-connector-list.component";
import { ShopifyConnectorFormComponent } from "./shopify-connector/shopify-connector-form/shopify-connector-form.component";
import { InventoryOnlineComponent } from './inventory/inventory-online/inventory-online.component';
import { ShippingPartnerFormComponent } from './shipping-partner/shipping-partner-form/shipping-partner-form.component';
import { ShippingPartnerListComponent } from './shipping-partner/shipping-partner-list/shipping-partner-list.component';
// import { InventoryListComponent } from "./inventory/inventory-list/inventory-list.component";

@NgModule({
  declarations: [
    VendorFormComponent,
    VendorListComponent,
    CompanyListComponent,
    TradeTermListComponent,
    TradeTermFormComponent,
    DepartmentFormComponent,
    DepartmentListComponent,
    CompanyFormComponent,
    CurrencyFormComponent,
    CurrencyListComponent,
    ShopifyConnectorListComponent,
    ShopifyConnectorFormComponent,
    InventoryOnlineComponent,
    ShippingPartnerFormComponent,
    ShippingPartnerListComponent,
    // InventoryListComponent
  ],
  imports: [
    CommonModule,
    ProductRoutingModule,
    SharedModule,
    FormsModule,
    PaginationModule,
    AdminFormModule,
    InputNumberModule,
    DatepickerModule,
    TooltipModule,
  ],
})
export class BusinessModule {}
