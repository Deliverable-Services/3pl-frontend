import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CreditTermsService } from 'src/app/@core/mock/credit-terms.service';
import {
  SortEventArg
} from "ng-devui";
import { PageParam, SearchParam } from "src/app/@core/data/searchFormData";

@Component({
  selector: 'app-credit-terms-list',
  templateUrl: './credit-terms-list.component.html',
  styleUrls: ['./credit-terms-list.component.scss']
})
export class CreditTermsListComponent implements OnInit {

  pageParam: any = {
    pageNo: "",
    pageSize: "",
    sortBy: "",
    sortDir: "",
  };
  busy: Subscription | undefined;
  basicDataSource: any[] = [];
  pager = {
    total: 0,
    pageIndex: 1,
    pageSize: 10,
  };

  columnSize: any = {
    termsName: "",
    updatedAt: "",
    action: "",
    active: "",
  };

  constructor(
    private creditTermsService: CreditTermsService
  ) { }

  ngOnInit(): void {
    this.getCreditTermsList();
  }

  getCreditTermsList() {
    this.busy = this.creditTermsService
      .getList()
      .subscribe((res) => {
        this.basicDataSource = res.content;
        this.pager.total = res.totalItems;
        Object.keys(res.listSize).map((key) => {
          let widthValue = res.listSize[key] + "%";
          this.columnSize[key] = widthValue;
        });
      });
  }

  multiSortChange(e: SortEventArg[]) {
    if (e.length === 1) {
      this.pageParam.sortBy = e[0].field;
      this.pageParam.sortDir = e[0].direction.toLowerCase();
      this.creditTermsService.setPageParams(this.pageParam);
      this.getCreditTermsList();
    }
  }

  setPageParams(pageParam: PageParam) {
    this.creditTermsService.setPageParams(pageParam);
    this.getCreditTermsList();
  }

  onPageChange(e: number) {
    this.pager.pageIndex = e;
    this.pageParam.pageNo = this.pager.pageIndex - 1;
    this.setPageParams(this.pageParam);
    this.getCreditTermsList();
  }

  onSizeChange(e: number) {
    this.pager.pageSize = e;
    this.pageParam.pageSize = e;
    this.setPageParams(this.pageParam);
    this.getCreditTermsList();
  }

}
