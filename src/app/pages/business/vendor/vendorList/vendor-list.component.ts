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
import { VendorListDataService } from "src/app/@core/mock/vendor-data.service";
import { FormConfig } from "src/app/@shared/components/admin-form";

@Component({
  selector: "da-vendor-list",
  templateUrl: "./vendor-list.component.html",
  styleUrls: ["./vendor-list.component.scss"],
})
export class VendorListComponent implements OnInit {
  filterAreaShow = false;
  isAdd: string = "ADD";

  pageParam: any = {
    pageNo: "",
    pageSize: "",
    sortBy: "",
    sortDir: "",
  };

  isAddSession: boolean = true;
  @Output() checked = new EventEmitter();

  searchWithVendorName: SearchParam = {
    keyword: "",
    sort: "asc",
    columnName: "vendorName",
    searchType: "match",
  };

  searchWithVendorCode: SearchParam = {
    keyword: "",
    sort: "asc",
    columnName: "vendorCode",
    searchType: "match",
  };

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
    vendorName: "",
    vendorCode: "",
    phone: "",
    updatedAt: "",
    action: "",
    active: "",
  };

  busy!: Subscription;

  constructor(
    private vendorListDataService: VendorListDataService,
    private dialogService: DialogService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.getVendorList();
  }

  getVendorList() {
    this.busy = this.vendorListDataService
      .getVendorList()
      .subscribe((res: any) => {
        this.basicDataSource = res.content;
        this.pager.total = res.totalItems;
        Object.keys(res.listSize).map((key: string) => {
          let widthValue = res.listSize[key] + "%";
          this.columnSize[key] = widthValue;
        });
      });
  }

  editVendor(rowId: any, index: number) {
    this.router.navigate([`/business/vendor/edit/${rowId}`]);
  }

  setSearchParams(searchParam: SearchParam) {
    this.vendorListDataService.setSearchParams(searchParam);
    this.getVendorList();
  }

  setPageParams(pageParam: PageParam) {
    this.vendorListDataService.setPageParams(pageParam);
    this.getVendorList();
  }

  onPageChange(e: number) {
    this.pager.pageIndex = e;
    this.pageParam.pageNo = this.pager.pageIndex - 1;
    this.setPageParams(this.pageParam);
    this.getVendorList();
  }

  onSizeChange(e: number) {
    this.pager.pageSize = e;
    this.pageParam.pageSize = e;
    this.setPageParams(this.pageParam);
    this.getVendorList();
  }

  search(e: any, searchParam: SearchParam) {
    searchParam.keyword = e.target.value;
    this.setSearchParams(searchParam);
    this.getVendorList();
  }

  multiSortChange(e: SortEventArg[]) {
    if (e.length === 1) {
      this.pageParam.sortBy = e[0].field;
      this.pageParam.sortDir = e[0].direction.toLowerCase();
      this.vendorListDataService.setPageParams(this.pageParam);
      this.getVendorList();
    }
  }
}
