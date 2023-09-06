import {
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

import {
  ToastService
} from "ng-devui";
import { Subscription } from "rxjs";
import { Company } from "src/app/@core/data/companyList";
import { PageParam, SearchParam } from "src/app/@core/data/searchFormData";
import { ShippingPartnerService } from "src/app/@core/mock/shipping-partner.service";

@Component({
  selector: 'app-shipping-partner-list',
  templateUrl: './shipping-partner-list.component.html',
  styleUrls: ['./shipping-partner-list.component.scss']
})
export class ShippingPartnerListComponent implements OnInit {
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
    private shippingPartnerService: ShippingPartnerService,
    private router: Router,
    private toastService: ToastService,
  ) {}

  ngOnInit() {
    this.getList();
  }

  getList() {
    this.busy = this.shippingPartnerService
      .getList()
      .subscribe((res: any) => {
        console.log(res);
        this.basicDataSource = res.content;
        this.pager.total = res.totalItems;
      });
  }

  edit(rowId: any, index: number) {
    this.router.navigate([`/business/shipping-partner/edit/${rowId}`]);
  }

  setSearchParams(searchParam: SearchParam) {
    this.shippingPartnerService.setSearchParams(searchParam);
    this.getList();
  }

  setPageParams(pageParam: PageParam) {
    this.shippingPartnerService.setPageParams(pageParam);
    this.getList();
  }

  onPageChange(e: number) {
    this.pager.pageIndex = e;
    this.pageParam.pageNo = this.pager.pageIndex - 1;
    this.setPageParams(this.pageParam);
    this.getList();
  }

  onSizeChange(e: number) {
    this.pager.pageSize = e;
    this.pageParam.pageSize = e;
    this.setPageParams(this.pageParam);
    this.getList();
  }

  search(e: any, searchParam: SearchParam) {
    searchParam.keyword = e.target.value;
    this.setSearchParams(searchParam);
    this.getList();
  }

  multiSortChange(e: SortEventArg[]) {
    if (e.length === 1) {
      this.pageParam.sortBy = e[0].field;
      this.pageParam.sortDir = e[0].direction.toLowerCase();
      this.shippingPartnerService.setPageParams(this.pageParam);
      this.getList();
    }
  }

  deleteRow(rowId: any) {
    this.shippingPartnerService
    .delete(rowId)
    .subscribe((res) => {
      this.getList();
      this.toastService.open({
        value: [
          { severity: 'success', content: 'Record Deleted'},
        ],
        life: 2000,
      });
    });
  }
}
