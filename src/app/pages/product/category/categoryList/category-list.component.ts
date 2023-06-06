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
import { Category } from "src/app/@core/data/categoryList";
import { PageParam, SearchParam } from "src/app/@core/data/searchFormData";
import { BrandListDataService } from "src/app/@core/mock/brand-data.service";
import { CategoryListDataService } from "src/app/@core/mock/category-data.service";
import { FormConfig } from "src/app/@shared/components/admin-form";

@Component({
  selector: "da-category-list",
  templateUrl: "./category-list.component.html",
  styleUrls: ["./category-list.component.scss"],
})
export class CategoryListComponent implements OnInit {
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

  tableWidthConfig: TableWidthConfig[] = [];

  basicDataSource: Brand[] = [];

  formData = {};

  editForm: any = null;

  editRowIndex = -1;

  pager = {
    total: 0,
    pageIndex: 1,
    pageSize: 10,
  };

  searchWithCategoryName: SearchParam = {
    keyword: "",
    sort: "asc",
    columnName: "categoryName",
    searchType: "match",
  };

  columnSize: any = {
    categoryName: "",
    updatedAt: "",
    action: "",
    active: "",
  };

  busy: Subscription | undefined;

  constructor(
    private categoryListDataService: CategoryListDataService,
    private dialogService: DialogService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.getCategoryList();
  }

  getCategoryList() {
    this.busy = this.categoryListDataService
      .getCategoryList()
      .subscribe((res) => {
        this.basicDataSource = res.content;
        this.pager.total = res.totalItems;
        Object.keys(res.listSize).map((key) => {
          let widthValue = res.listSize[key] + "%";
          this.columnSize[key] = widthValue;
        });
      });
  }

  setSearchParams(searchParam: SearchParam) {
    this.categoryListDataService.setSearchParams(searchParam);
    this.getCategoryList();
  }

  setPageParams(pageParam: PageParam) {
    this.categoryListDataService.setPageParams(pageParam);
    this.getCategoryList();
  }

  toggleCheck(activeCheck: any, rowId: any) {
    let data = {
      active: activeCheck == false ? "inactive" : "active",
      categoryId: rowId.categoryId,
    };
    this.categoryListDataService.statusToggle(data).subscribe((res: any) => {});
  }

  editRow(rowId: any, index: number) {
    this.isAdd = "EDIT";
    this.editRowIndex = index;
    this.router.navigate([`/product/category/edit/${rowId}`]);
  }

  onPageChange(e: number) {
    this.pager.pageIndex = e;
    this.pageParam.pageNo = this.pager.pageIndex - 1;
    this.setPageParams(this.pageParam);
    this.getCategoryList();
  }

  onSizeChange(e: number) {
    this.pager.pageSize = e;
    this.pageParam.pageSize = e;
    this.setPageParams(this.pageParam);
    this.getCategoryList();
  }

  search(e: any, searchParam: SearchParam) {
    searchParam.keyword = e.target.value;
    this.setSearchParams(searchParam);
    this.getCategoryList();
  }

  multiSortChange(e: SortEventArg[]) {
    if (e.length === 1) {
      this.pageParam.sortBy = e[0].field;
      this.pageParam.sortDir = e[0].direction.toLowerCase();
      this.categoryListDataService.setPageParams(this.pageParam);
      this.getCategoryList();
    }
  }
}
