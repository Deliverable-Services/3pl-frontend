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

  dropdownValues: any[] = ['All','Draft', 'Inactive', 'Active'];
  dropdownSearch: any = {
    status: ''
  }
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
    styleName: "20%",
    styleCode: "10%",
    createdAt: "10%",
    updatedAt: "10%",
    action: "10%",
    active: "10%",
  };

  busy: Subscription | undefined;
  mode: string | undefined;

  constructor(
    private productsListDataService: ProductsListDataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.pageParam.pageNo = 0;
    this.productsListDataService.setPageParams(this.pageParam);
    this.searchWithStyleName.keyword = "";
    console.log('this.searchWithStyleName',this.searchWithStyleName);
    
    this.productsListDataService.setSearchParams(this.searchWithStyleName)
    this.getProductsList();
  }

  getProductsList() {
    this.busy = this.productsListDataService.getList().subscribe((res) => {
      this.pager.total = res.totalItems;
      this.basicDataSource = res.content;
      // Object.keys(res.listSize).map((key) => {
      //   let widthValue = res.listSize[key] + "%";
      //   return (this.columnSize[key] = widthValue);
      // });
      console.log('column size',this.columnSize);
      
    });
  }

  editStyle(rowId: any, index: number) {
    this.router.navigate([`/product/products/edit/${rowId}`]);
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

  startSearch(event: any) {
    // console.log(':: dropdownSearch.status :: ', this.dropdownSearch.status)
    if(this.dropdownSearch.status == "All"){
      this.dropdownSearch.status = ""; 
    }
    this.setSearchParams({
      columnName: 'status',
      searchType: 'match',
      keyword: this.dropdownSearch.status 
    });
  }
}
