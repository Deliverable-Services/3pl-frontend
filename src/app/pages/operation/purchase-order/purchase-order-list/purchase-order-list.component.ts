import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";
import {
  DialogService,
  FormLayout,
  SortEventArg,
  TableWidthConfig,
} from "ng-devui";
import { Subscription } from "rxjs";
import { Brand } from "src/app/@core/data/brandList";
import { PageParam, SearchParam } from "src/app/@core/data/searchFormData";
import { BrandListDataService } from "src/app/@core/mock/brand-data.service";
import { PoDataService } from "src/app/@core/mock/po-data.service";
import { VendorListDataService } from "src/app/@core/mock/vendor-data.service";
import { FormConfig } from "src/app/@shared/components/admin-form";

@Component({
  selector: "app-purchase-order-list",
  templateUrl: "./purchase-order-list.component.html",
  styleUrls: ["./purchase-order-list.component.scss"],
})
export class PurchaseOrderListComponent implements OnInit {
  filterAreaShow = false;
  isAdd: string = "ADD";

  pageParam: any = {
    pageNo: "",
    pageSize: "",
    sortBy: "",
    sortDir: "",
  };

  searchWithDepartmentName: SearchParam = {
    keyword: "",
    sort: "asc",
    columnName: "poReference",
    searchType: "match",
  };

  isAddSession: boolean = true;
  @Output() checked = new EventEmitter();

  basicDataSource: Brand[] = [];

  formData = {};

  editForm: any = null;

  editRowIndex = -1;

  pager = {
    total: 0,
    pageIndex: 1,
    pageSize: 10,
  };

  columnSize: any = {
    poReference: "",
    status: "",
    sampleStatus: "",
    vendorName: "",
    issueDate: "",
    updatedAt: "",
    action: "",
  };

  busy: Subscription | undefined;

  constructor(
    private poDataService: PoDataService,
    private dialogService: DialogService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.getPoList();
  }

  getPoList() {
    this.busy = this.poDataService.getPOList().subscribe((res: any) => {
      this.basicDataSource = res.content.map((content: any) => {
        return { ...content, vendorName: content.vendor.vendorName };
      });
      this.pager.total = res.totalItems;
      Object.keys(res.listSize).map((key: string) => {
        let widthValue = res.listSize[key] + "%";
        this.columnSize[key] = widthValue;
      });
    });
  }

  editPO(rowId: any, index: number) {
    this.router.navigate([`/operation/purchase-order/edit/${rowId}`]);
  }

  setSearchParams(searchParam: SearchParam) {
    this.poDataService.setSearchParams(searchParam);
    this.getPoList();
  }

  setPageParams(pageParam: PageParam) {
    this.poDataService.setPageParams(pageParam);
    this.getPoList();
  }

  onPageChange(e: number) {
    this.pager.pageIndex = e;
    this.pageParam.pageNo = this.pager.pageIndex - 1;
    this.setPageParams(this.pageParam);
    this.getPoList();
  }

  onSizeChange(e: number) {
    this.pager.pageSize = e;
    this.pageParam.pageSize = e;
    this.setPageParams(this.pageParam);
    this.getPoList();
  }

  search(e: any, searchParam: SearchParam) {
    searchParam.keyword = e.target.value;
    this.setSearchParams(searchParam);
    this.getPoList();
  }

  multiSortChange(e: SortEventArg[]) {
    if (e.length === 1) {
      this.pageParam.sortBy = e[0].field;
      this.pageParam.sortDir = e[0].direction.toLowerCase();
      this.poDataService.setPageParams(this.pageParam);
      this.getPoList();
    }
  }
}
