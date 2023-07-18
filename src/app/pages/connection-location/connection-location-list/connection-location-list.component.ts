import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from "@angular/router";
// import { CreditTermsService } from 'src/app/@core/mock/credit-terms.service';
import { ConnectionLocationService } from 'src/app/@core/mock/connection-location.service';
import {
  SortEventArg
} from "ng-devui";
import { PageParam, SearchParam } from "src/app/@core/data/searchFormData";

@Component({
  selector: 'app-connection-location-list',
  templateUrl: './connection-location-list.component.html',
  styleUrls: ['./connection-location-list.component.scss']
})
export class ConnectionLocationListComponent implements OnInit {

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
    nodeName: "10%",
    lastModifiedBy:"10%",
    lastModifiedDate:"10%",
    shopifyLocationId:"10%",
    lgStoreWhsId:"10%",
    nodeType:"10%",
    lgStoreOwnerId:"10%",
    updatedAt: "10%",
    action: "10%",
    active: "10%",
  };

  constructor(
    private connectionLocationService: ConnectionLocationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getCreditTermsList();
  }

  getCreditTermsList() {
    this.busy = this.connectionLocationService
      .getList()
      .subscribe((res) => {
        console.log(':: res ', res)
        this.basicDataSource = res;
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
      this.connectionLocationService.setPageParams(this.pageParam);
      this.getCreditTermsList();
    }
  }

  setPageParams(pageParam: PageParam) {
    this.connectionLocationService.setPageParams(pageParam);
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
    this.router.navigate([`/connection-location/edit/${rowId}`]);
  }

}
