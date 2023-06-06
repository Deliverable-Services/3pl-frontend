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
import { TradeListDataService } from "src/app/@core/mock/Trade-data.service";
import { BrandListDataService } from "src/app/@core/mock/brand-data.service";
import { VendorListDataService } from "src/app/@core/mock/vendor-data.service";
import { FormConfig } from "src/app/@shared/components/admin-form";
import { PageParam, SearchParam } from "src/app/@core/data/searchFormData";

@Component({
  selector: "da-tradeTerm-list",
  templateUrl: "./tradeTerm-list.component.html",
  styleUrls: ["./tradeTerm-list.component.scss"],
})
export class TradeTermListComponent implements OnInit {
  filterAreaShow = false;
  isAdd: string = "ADD";

  pageParam: any = {
    pageNo: "",
    pageSize: "",
    sortBy: "",
    sortDir: "",
  };

  searchWithTradeSubject: SearchParam = {
    keyword: "",
    sort: "asc",
    columnName: "tradeSubject",
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
    tradeSubject: "",
    updatedAt: "",
    action: "",
    active: "",
  };

  busy!: Subscription;

  constructor(
    private tradeListDataService: TradeListDataService,
    private dialogService: DialogService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.getTradeList();
  }

  getTradeList() {
    this.busy = this.tradeListDataService
      .getTradeList()
      .subscribe((res: any) => {
        this.basicDataSource = res.content;
        this.pager.total = res.totalItems;
        Object.keys(res.listSize).map((key: string) => {
          let widthValue = res.listSize[key] + "%";
          this.columnSize[key] = widthValue;
        });
      });
  }

  editTrade(rowId: any, index: number) {
    this.router.navigate([`/business/trade-terms/edit/${rowId}`]);
  }

  setSearchParams(searchParam: SearchParam) {
    this.tradeListDataService.setSearchParams(searchParam);
    this.getTradeList();
  }

  setPageParams(pageParam: PageParam) {
    this.tradeListDataService.setPageParams(pageParam);
    this.getTradeList();
  }

  onPageChange(e: number) {
    this.pager.pageIndex = e;
    this.pageParam.pageNo = this.pager.pageIndex - 1;
    this.setPageParams(this.pageParam);
    this.getTradeList();
  }

  onSizeChange(e: number) {
    this.pager.pageSize = e;
    this.pageParam.pageSize = e;
    this.setPageParams(this.pageParam);
    this.getTradeList();
  }

  search(e: any, searchParam: SearchParam) {
    searchParam.keyword = e.target.value;
    this.setSearchParams(searchParam);
    this.getTradeList();
  }

  multiSortChange(e: SortEventArg[]) {
    if (e.length === 1) {
      this.pageParam.sortBy = e[0].field;
      this.pageParam.sortDir = e[0].direction.toLowerCase();
      this.tradeListDataService.setPageParams(this.pageParam);
      this.getTradeList();
    }
  }
}
