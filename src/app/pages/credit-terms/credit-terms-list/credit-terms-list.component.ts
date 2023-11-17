import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from "@angular/router";
import { CreditTermsService } from 'src/app/@core/mock/credit-terms.service';
import {
  SortEventArg,
  ToastService
} from "ng-devui";
import { PageParam, SearchParam } from "src/app/@core/data/searchFormData";
import { MSG } from 'src/config/global-var';

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
    private creditTermsService: CreditTermsService,
    private router: Router,
    private toastService: ToastService,
  ) { }

  ngOnInit(): void {
    this.pageParam.pageSize = 50;
    this.pager.pageSize = 50;
    this.creditTermsService.setPageParams(this.pageParam);
    this.getCreditTermsList();
  }

  getCreditTermsList() {
    this.busy = this.creditTermsService
      .getList()
      .subscribe((res) => {
        this.basicDataSource = res.content;
        this.pager.total = res.totalItems;
        // Object.keys(res.listSize).map((key) => {
        //   let widthValue = res.listSize[key] + "%";
        //   this.columnSize[key] = widthValue;
        // });
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

  editRow(rowId: any, index: number) {
    this.router.navigate([`/credit-terms/edit/${rowId}`]);
  }

  updateStatus(event: any, row: any) {
    let sVal =  event ? 'active':'inactive';
    console.log(':: ', row, row?.rowItem?.creditTermsId, sVal);

    this.creditTermsService
    .statusToggle({id: row?.rowItem?.creditTermsId, active: sVal})
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
