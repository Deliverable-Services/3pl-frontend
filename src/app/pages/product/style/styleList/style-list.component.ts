import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
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
import { StyleListDataService } from "src/app/@core/mock/style-data.service";

@Component({
  selector: "da-style-list",
  templateUrl: "./style-list.component.html",
  styleUrls: ["./style-list.component.scss"],
})
export class StyleListComponent implements OnInit {
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
    private styleListDataService: StyleListDataService,
    private dialogService: DialogService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.getStyleList();
  }

  getStyleList() {
    this.busy = this.styleListDataService.getStyleList().subscribe((res) => {
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
    this.styleListDataService.setSearchParams(searchParam);
    this.getStyleList();
  }

  setPageParams(pageParam: PageParam) {
    this.styleListDataService.setPageParams(pageParam);
    this.getStyleList();
  }

  onPageChange(e: number) {
    this.pager.pageIndex = e;
    this.pageParam.pageNo = this.pager.pageIndex - 1;
    this.setPageParams(this.pageParam);
    this.getStyleList();
  }

  onSizeChange(e: number) {
    this.pager.pageSize = e;
    this.pageParam.pageSize = e;
    this.setPageParams(this.pageParam);
    this.getStyleList();
  }

  search(e: any, searchParam: SearchParam) {
    searchParam.keyword = e.target.value;
    this.setSearchParams(searchParam);
    this.getStyleList();
  }

  multiSortChange(e: SortEventArg[]) {
    if (e.length === 1) {
      this.pageParam.sortBy = e[0].field;
      this.pageParam.sortDir = e[0].direction.toLowerCase();
      this.styleListDataService.setPageParams(this.pageParam);
      this.getStyleList();
    }
  }

  toggleCheck(activeCheck: any, rowId: any) {
    let data = {
      active: activeCheck == false ? "inactive" : "active",
      styleId: rowId.styleId,
    };
    this.styleListDataService.statusToggle(data).subscribe((res: any) => {});
  }
}
