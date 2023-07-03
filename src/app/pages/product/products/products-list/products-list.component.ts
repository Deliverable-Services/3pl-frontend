import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from "@angular/core";
import { Router } from "@angular/router";
import {
  DialogService,
  SortEventArg,
} from "ng-devui";
import { Subscription } from "rxjs";
import { Brand } from "src/app/@core/data/brandList";
import { PageParam, SearchParam } from "src/app/@core/data/searchFormData";
import { ProductsListDataService } from "src/app/@core/mock/products-data.service";

@Component({
  selector: "app-products-list",
  templateUrl: "./products-list.component.html",
  styleUrls: ["./products-list.component.scss"],
})
export class ProductsListComponent implements OnInit {
  filterAreaShow = false;

  pageParam: any = {
    pageNo: "",
    pageSize: "",
    sortBy: "",
    sortDir: "asc",
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

  searchWithStyleName: SearchParam = {
    keyword: "",
    sort: "asc",
    columnName: "styleName",
    searchType: "match",
  };

  searchWithStyleCode: SearchParam = {
    keyword: "",
    sort: "asc",
    columnName: "styleCode",
    searchType: "match",
  };

  columnSize: any = {
    styleName: "",
    styleCode: "",
    createdAt: "",
    updatedAt: "",
    action: "",
    active: "",
  };

  busy: Subscription | undefined;
  mode: string | undefined;

  constructor(
    private productsListDataService: ProductsListDataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getProductsList();
  }

  getProductsList() {
    this.busy = this.productsListDataService.getList().subscribe((res) => {
      this.pager.total = res.totalItems;
      this.basicDataSource = res.content;
      Object.keys(res.listSize).map((key) => {
        let widthValue = res.listSize[key] + "%";
        return (this.columnSize[key] = widthValue);
      });
    });
  }

  editStyle(rowId: any, index: number) {
    this.router.navigate([`/product/style/edit/${rowId}`]);
  }

  setSearchParams(searchParam: SearchParam) {
    this.productsListDataService.setSearchParams(searchParam);
    this.getProductsList();
  }

  setPageParams(pageParam: PageParam) {
    this.productsListDataService.setPageParams(pageParam);
    this.getProductsList();
  }

  onPageChange(e: number) {
    this.pager.pageIndex = e;
    this.pageParam.pageNo = this.pager.pageIndex - 1;
    this.setPageParams(this.pageParam);
    this.getProductsList();
  }

  onSizeChange(e: number) {
    this.pager.pageSize = e;
    this.pageParam.pageSize = e;
    this.setPageParams(this.pageParam);
    this.getProductsList();
  }

  search(e: any, searchParam: SearchParam) {
    searchParam.keyword = e.target.value;
    this.setSearchParams(searchParam);
    this.getProductsList();
  }

  multiSortChange(e: SortEventArg[]) {
    if (e.length === 1) {
      this.pageParam.sortBy = e[0].field;
      this.pageParam.sortDir = e[0].direction.toLowerCase();
      this.productsListDataService.setPageParams(this.pageParam);
      this.getProductsList();
    }
  }

  toggleCheck(activeCheck: any, rowId: any) {
    let data = {
      active: activeCheck == false ? "inactive" : "active",
      styleId: rowId.styleId,
    };
    this.productsListDataService.statusToggle(data).subscribe((res: any) => {});
  }
}
