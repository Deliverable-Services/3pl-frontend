import {
  Component,
  EventEmitter,
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

import {
  ToastService
} from "ng-devui";
import { MSG } from 'src/config/global-var';
import { Subscription } from "rxjs";
import { Company } from "src/app/@core/data/companyList";
import { CurrencyListData } from "src/app/@core/data/CurrencyList";
import { PageParam, SearchParam } from "src/app/@core/data/searchFormData";
import { CompanyDataService } from "src/app/@core/mock/company-data.service";
import { CurrencyDataService } from "src/app/@core/mock/currency-data.service";

import { FormConfig } from "src/app/@shared/components/admin-form";

@Component({
  selector: "app-currency-list",
  templateUrl: "./currency-list.component.html",
  styleUrls: ["./currency-list.component.scss"],
})
export class CurrencyListComponent implements OnInit {
  pageParam: any = {
    pageNo: "",
    pageSize: "",
    sortBy: "",
    sortDir: "",
  };

  @Output() checked = new EventEmitter();
  basicDataSource: Company[] = [];

  searchWithFromCurrency: SearchParam = {
    keyword: "",
    // sort: "asc",
    columnName: "currencyCode",
    searchType: "match",
  };

  pager = {
    total: 0,
    pageIndex: 1,
    pageSize: 10,
  };

  columnSize: any = {
    currencyName: "",
    currencyCode: "",
    rate: 1,
    createdDate: "",
    action: "",
    active: "",
  };

  busy: Subscription | undefined;

  constructor(
    private currencyDataService: CurrencyDataService,
    private dialogService: DialogService,
    private router: Router,
    private toastService: ToastService,
  ) {}

  ngOnInit() {
    this.pageParam.pageSize = 50;;
    this.pager.pageSize = 50;;
    this.currencyDataService.setPageParams(this.pageParam);
    this.getExchangeRateList();
  }

  getExchangeRateList() {
    this.busy = this.currencyDataService
      .getCurrencyList()
      .subscribe((res: any) => {
        console.log(res);
        this.basicDataSource = res.content;
        this.pager.total = res.totalItems;
        // Object.keys(res.listSize).map((key: string) => {
        //   let widthValue = res.listSize[key] + "%";
        //   this.columnSize[key] = widthValue;
        // });
      });
  }

  editCurrency(rowId: any, index: number) {
    this.router.navigate([`/business/currency/edit/${rowId}`]);
  }

  setSearchParams(searchParam: SearchParam) {
    this.currencyDataService.setSearchParams(searchParam);
    this.getExchangeRateList();
  }

  setPageParams(pageParam: PageParam) {
    this.currencyDataService.setPageParams(pageParam);
    this.getExchangeRateList();
  }

  onPageChange(e: number) {
    this.pager.pageIndex = e;
    this.pageParam.pageNo = this.pager.pageIndex - 1;
    this.setPageParams(this.pageParam);
    this.getExchangeRateList();
  }

  onSizeChange(e: number) {
    this.pager.pageSize = e;
    this.pageParam.pageSize = e;
    this.setPageParams(this.pageParam);
    this.getExchangeRateList();
  }

  search(e: any, searchParam: SearchParam) {
    searchParam.keyword = e.target.value;
    this.setSearchParams(searchParam);
    this.getExchangeRateList();
  }

  multiSortChange(e: SortEventArg[]) {
    if (e.length === 1) {
      this.pageParam.sortBy = e[0].field;
      this.pageParam.sortDir = e[0].direction.toLowerCase();
      this.currencyDataService.setPageParams(this.pageParam);
      this.getExchangeRateList();
    }
  }

  updateStatus(event: any, row: any) {
    let sVal =  event ? 'active':'inactive';
    console.log(':: ', row, row?.rowItem?.currencyId, sVal);

    this.currencyDataService
    .statusToggle({id: row?.rowItem?.currencyId, active: sVal})
    .subscribe((res: any) => {
      let type, msg;
      if(res) {
        type = 'success';
        msg = MSG.status.success;
      } else {
        type = 'error';
        msg = MSG.error;
      }
      this.toastService.open({
        value: [
          { severity: type, content: msg},
        ],
        life: 2000,
      });
    });
  }
}
