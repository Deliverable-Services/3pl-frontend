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
import { ShippingPartnerListComponent } from "./shipping-partner/shipping-partner-list/shipping-partner-list.component";
import { ShippingPartnerFormComponent } from "./shipping-partner/shipping-partner-form/shipping-partner-form.component";
import { TransferOrderListComponent } from "./transferOrder/transfer-order-list/transfer-order-list.component";
import { TransferOrderFormComponent } from "./transferOrder/transfer-order-form/transfer-order-form.component";
// import { InventoryListComponent } from "./inventory/inventory-list/inventory-list.component";

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
  {
    path: "shipping-partner",
    component: ShippingPartnerListComponent,
  },
  {
    path: "shipping-partner/add",
    component: ShippingPartnerFormComponent,
  },
  {
    path: "shipping-partner/edit/:id",
    component: ShippingPartnerFormComponent,
  },
  {
    path: "transfer-order",
    component: TransferOrderListComponent,
  },
  {
    path: "transfer-order/add",
    component: TransferOrderFormComponent,
  },
  {
    path: "transfer-order/edit/:id",
    component: TransferOrderFormComponent,
  },
  {
    path: "purchase-order",
    loadChildren: () =>
      import("./purchase-order/purchase-order.module").then((m) => m.PurchaseOrderModule),
  },
  {
    path: "shipment-and-shipping",
    loadChildren: () =>
      import("./shipment-and-shipping/shipment-and-shipping.module").then((m) => m.ShipmentAndShippingModule),
  },
  // {
  //   path: "inventory",
  //   component: InventoryListComponent,
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductRoutingModule {}
