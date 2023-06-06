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
import { Product } from "src/app/@core/data/productList";
import { PageParam, SearchParam } from "src/app/@core/data/searchFormData";
import { BrandListDataService } from "src/app/@core/mock/brand-data.service";
import { ProductListDataService } from "src/app/@core/mock/product-data.service";
import { FormConfig } from "src/app/@shared/components/admin-form";

@Component({
  selector: "da-product-list",
  templateUrl: "product-list.component.html",
  styleUrls: ["./product-list.component.scss"],
})
export class ProductListComponent implements OnInit {
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

  basicDataSource: any = [];

  formData = {};

  editForm: any = null;

  editRowIndex = -1;

  pager = {
    total: 0,
    pageIndex: 1,
    pageSize: 10,
  };

  busy: Subscription | undefined;

  searchWithProductSku: SearchParam = {
    keyword: "",
    sort: "asc",
    columnName: "p",
    searchType: "match",
  };

  columnSize: any = {
    productSku: "",
    productDesc: "",
    size: "",
    color: "",
    updatedAt: "",
    action: "",
    active: "",
  };

  constructor(
    private productListDataService: ProductListDataService,
    private dialogService: DialogService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.getProductList();
  }

  getProductList() {
    this.busy = this.productListDataService
      .getProductList()
      .subscribe((res: any) => {
        this.pager.total = res.totalItems;
        this.basicDataSource = res.content;
        Object.keys(res.listSize).map((key) => {
          let widthValue = res.listSize[key] + "%";
          return (this.columnSize[key] = widthValue);
        });
      });
  }

  editProduct(rowId: any, index: number) {
    this.router.navigate([`/product/product/edit/${rowId}`]);
  }

  setSearchParams(searchParam: SearchParam) {
    this.productListDataService.setSearchParams(searchParam);
    this.getProductList();
  }

  setPageParams(pageParam: PageParam) {
    this.productListDataService.setPageParams(pageParam);
    this.getProductList();
  }

  onPageChange(e: number) {
    this.pager.pageIndex = e;
    this.pageParam.pageNo = this.pager.pageIndex - 1;
    this.setPageParams(this.pageParam);
    this.getProductList();
  }

  onSizeChange(e: number) {
    this.pager.pageSize = e;
    this.pageParam.pageSize = e;
    this.setPageParams(this.pageParam);
    this.getProductList();
  }

  search(e: any, searchParam: SearchParam) {
    searchParam.keyword = e.target.value;
    this.setSearchParams(searchParam);
    this.getProductList();
  }

  multiSortChange(e: SortEventArg[]) {
    if (e.length === 1) {
      this.pageParam.sortBy = e[0].field;
      this.pageParam.sortDir = e[0].direction.toLowerCase();
      this.productListDataService.setPageParams(this.pageParam);
      this.getProductList();
    }
  }

  toggleCheck(activeCheck: any, rowId: any) {
    let data = {
      active: activeCheck == false ? "inactive" : "active",
      productId: rowId.productId,
    };
    this.productListDataService.statusToggle(data).subscribe((res: any) => {});
  }
}
