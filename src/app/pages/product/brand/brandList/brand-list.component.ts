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
import { FormConfig } from "src/app/@shared/components/admin-form";

@Component({
  selector: "da-brand-list",
  templateUrl: "./brand-list.component.html",
  styleUrls: ["./brand-list.component.scss"],
})
export class BrandListComponent implements OnInit {
  filterAreaShow = false;
  isAdd: string = "ADD";

  isAddSession: boolean = true;
  @Output() checked = new EventEmitter();

  pageParam: any = {
    pageNo: "",
    pageSize: "",
    sortBy: "",
    sortDir: "",
  };

  searchWithBrandName: SearchParam = {
    keyword: "",
    sort: "asc",
    columnName: "brandName",
    searchType: "match",
  };

  searchWithBrandCode: SearchParam = {
    keyword: "",
    sort: "asc",
    columnName: "brandCode",
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
    brandName: "",
    brandCode: "",
    updatedAt: "",
    action: "",
    active: "",
  };

  busy: Subscription | undefined;

  tableWidthConfig: TableWidthConfig[] = [];

  constructor(
    private brandListDataService: BrandListDataService,
    private dialogService: DialogService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.brandListDataService.resetParams();
    this.getBrandList();
  }

  getBrandList() {
    this.busy = this.brandListDataService
      .getBrandList()
      .subscribe((res: any) => {
        this.basicDataSource = res.content;
        this.pager.total = res.totalItems;
        Object.keys(res.listSize).map((key: string) => {
          let widthValue = res.listSize[key] + "%";
          this.columnSize[key] = widthValue;
        });
      });
  }

  editBrand(rowId: any, index: number) {
    this.isAdd = "EDIT";
    this.editRowIndex = index;
    console.log({ rowId });
    this.router.navigate([`/product/brand/edit/${rowId}`]);
  }

  setSearchParams(searchParam: SearchParam) {
    this.brandListDataService.setSearchParams(searchParam);
    this.getBrandList();
  }

  setPageParams(pageParam: PageParam) {
    this.brandListDataService.setPageParams(pageParam);
    this.getBrandList();
  }

  search(e: any, searchParam: SearchParam) {
    searchParam.keyword = e.target.value;
    this.setSearchParams(searchParam);
    this.getBrandList();
  }

  multiSortChange(e: SortEventArg[]) {
    if (e.length === 1) {
      this.pageParam.sortBy = e[0].field;
      this.pageParam.sortDir = e[0].direction.toLowerCase();
      this.brandListDataService.setPageParams(this.pageParam);
      this.getBrandList();
    }
  }

  onPageChange(e: number) {
    this.pager.pageIndex = e;
    this.pageParam.pageNo = this.pager.pageIndex - 1;
    this.setPageParams(this.pageParam);
    this.getBrandList();
  }

  onSizeChange(e: number) {
    this.pager.pageSize = e;
    this.pageParam.pageSize = e;
    this.setPageParams(this.pageParam);
    this.getBrandList();
  }

  toggleCheck(activeCheck: any, rowId: any) {
    let data = {
      active: activeCheck == false ? "inactive" : "active",
      brandId: rowId.brandId,
    };

    this.brandListDataService.statusToggle(data).subscribe((res: any) => {
      console.log(res);
    });
  }
}
