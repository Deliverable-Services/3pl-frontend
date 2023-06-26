import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from "@angular/router";
import { ShopifyConnectorService } from 'src/app/@core/mock/shopify-connector.service';
import {
  SortEventArg,
  ToastService
} from "ng-devui";
import { PageParam, SearchParam } from "src/app/@core/data/searchFormData";
import { MSG } from 'src/config/global-var';

@Component({
  selector: "app-shopify-connector-list",
  templateUrl: "./shopify-connector-list.component.html",
  styleUrls: ["./shopify-connector-list.component.scss"],
})
export class ShopifyConnectorListComponent implements OnInit {

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
    private shopifyConnectorService: ShopifyConnectorService,
    private router: Router,
    private toastService: ToastService,
  ) { }

  ngOnInit(): void {
    this.getList();
  }

  getList() {
    this.busy = this.shopifyConnectorService
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
      this.shopifyConnectorService.setPageParams(this.pageParam);
      this.getList();
    }
  }

  setPageParams(pageParam: PageParam) {
    this.shopifyConnectorService.setPageParams(pageParam);
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

  editRow(rowId: any, index: number) {
    this.router.navigate([`/shopify-connector/edit/${rowId}`]);
  }

  updateStatus(event: any, row: any) {
    let sVal =  event ? 'active':'inactive';
    console.log(':: ', row, row?.rowItem?.creditTermsId, sVal);

    this.shopifyConnectorService
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
