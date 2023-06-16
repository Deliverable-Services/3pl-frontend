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
import { ExchangeRateListData } from "src/app/@core/data/exchangeRateList";
import { PageParam, SearchParam } from "src/app/@core/data/searchFormData";
import { CompanyDataService } from "src/app/@core/mock/company-data.service";
import { ExchangeRateDataService } from "src/app/@core/mock/exchange-rate-data.service";

import { FormConfig } from "src/app/@shared/components/admin-form";

@Component({
  selector: "app-exchange-rate-list",
  templateUrl: "./exchange-rate-list.component.html",
  styleUrls: ["./exchange-rate-list.component.scss"],
})
export class ExchangeRateListComponent implements OnInit {
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
    sort: "asc",
    columnName: "fromCurrency",
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
    private exchangeRateDataService: ExchangeRateDataService,
    private dialogService: DialogService,
    private router: Router,
    private toastService: ToastService,
  ) {}

  ngOnInit() {
    this.getExchangeRateList();
  }

  getExchangeRateList() {
    this.busy = this.exchangeRateDataService
      .getExchangeRateList()
      .subscribe((res: any) => {
        console.log(res);
        this.basicDataSource = res.content;
        this.pager.total = res.totalItems;
        Object.keys(res.listSize).map((key: string) => {
          let widthValue = res.listSize[key] + "%";
          this.columnSize[key] = widthValue;
        });
      });
  }

  editExchangeRate(rowId: any, index: number) {
    this.router.navigate([`/business/exchange-rate/edit/${rowId}`]);
  }

  setSearchParams(searchParam: SearchParam) {
    this.exchangeRateDataService.setSearchParams(searchParam);
    this.getExchangeRateList();
  }

  setPageParams(pageParam: PageParam) {
    this.exchangeRateDataService.setPageParams(pageParam);
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
      this.exchangeRateDataService.setPageParams(this.pageParam);
      this.getExchangeRateList();
    }
  }

  updateStatus(event: any, row: any) {
    let sVal =  event ? 'active':'inactive';
    console.log(':: ', row, row?.rowItem?.currencyId, sVal);

    this.exchangeRateDataService
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
