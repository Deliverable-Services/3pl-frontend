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
import { StyleListDataService } from "./style-data.service";
import { VendorListDataService } from "./vendor-data.service";
import { TradeListDataService } from "./Trade-data.service";
import { CompanyDataService } from "./company-data.service";
import { DepartmentDataService } from "./department-data.service";
import { PoDataService } from "./po-data.service";
import { CreditTermsService } from "./credit-terms.service";
import { ConnectionLocationService } from "./connection-location.service";


const SERVICES = [
  CourseService,
  GanttDataService,
  BrandListDataService,
  VendorListDataService,
  TradeListDataService,
  ProductListDataService,
  UnitListDataService,
  StyleListDataService,
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
  ConnectionLocationService
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
