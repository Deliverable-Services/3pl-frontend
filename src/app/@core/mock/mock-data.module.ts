import { NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CourseService } from "./course.service";
import { GanttDataService } from "./gantt-data.service";
import { BrandListDataService } from "./brand-data.service";
import { WorkItemService } from "./work-item.service";
import { WorkGroupService } from "./work-group.service";
import { EchartsService } from "./echarts.service";
import { NoticeDataService } from "./notice-data.service";
import { CategoryListDataService } from "./category-data.service";
import { MaterialListDataService } from "./material-data.service";
import { ProductListDataService } from "./product-data.service";
import { UnitListDataService } from "./unit-data.service";
import { ProductsListDataService } from "./products-data.service";
import { VendorListDataService } from "./vendor-data.service";
import { TradeListDataService } from "./Trade-data.service";
import { CompanyDataService } from "./company-data.service";
import { DepartmentDataService } from "./department-data.service";
import { PoDataService } from "./po-data.service";
import { CreditTermsService } from "./credit-terms.service";
import { ConnectionLocationService } from "./connection-location.service";
import { ShopifyConnectorService } from "./shopify-connector.service";
import { InventoryService } from "./inventory.service";
import { InventoryOnlineService } from "./inventory-online-data.service";
import { UserManagementService } from "./user-management.service";
import { ShippingPartnerService } from "./shipping-partner.service";
import { TransferOrderListDataService } from "./tranfer-order.service";
import { PurchaseOrderService } from "./purchase-order.service";
import { ShippingOrderService } from "./shipping-order.service";
import { InvoiceManagementService } from "./invoice-management.service";
import { ShippingAddressService } from "./shipping-address.service";



const SERVICES = [
  CourseService,
  GanttDataService,
  BrandListDataService,
  VendorListDataService,
  TradeListDataService,
  ProductListDataService,
  UnitListDataService,
  ProductsListDataService,
  MaterialListDataService,
  CategoryListDataService,
  WorkItemService,
  WorkGroupService,
  EchartsService,
  NoticeDataService,
  CompanyDataService,
  DepartmentDataService,
  PoDataService,
  CreditTermsService,
  ConnectionLocationService,
  ShopifyConnectorService,
  InventoryService,
  InventoryOnlineService,
  UserManagementService,
  ShippingPartnerService,
  TransferOrderListDataService,
  PurchaseOrderService,
  ShippingOrderService,
  InvoiceManagementService,
  ShippingAddressService
];

@NgModule({
  imports: [CommonModule],
  providers: [...SERVICES],
})
  
export class MockDataModule {
  static forRoot(): ModuleWithProviders<MockDataModule> {
    return {
      ngModule: MockDataModule,
      providers: [...SERVICES],
    };
  }
}
