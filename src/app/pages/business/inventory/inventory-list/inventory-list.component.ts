import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from "@angular/router";
import { InventoryService } from 'src/app/@core/mock/inventory.service';
import {
  SortEventArg,
  ToastService
} from "ng-devui";
import { PageParam, SearchParam } from "src/app/@core/data/searchFormData";
import { MSG } from 'src/config/global-var';

@Component({
  selector: "app-inventory-list",
  templateUrl: "./inventory-list.component.html",
  styleUrls: ["./inventory-list.component.scss"],
})
export class InventoryListComponent implements OnInit {

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
    connectionLocationId: "",
    totalQty: "",
    unavailableQty: "",
    action: "",
    styleName: "",
    sku: "",
    avaiableQty: ""
  };

  constructor(
    private inventoryService: InventoryService,
    private router: Router,
    private toastService: ToastService,
  ) { }

  ngOnInit(): void {
    this.getList();
  }

  getList() {
    this.busy = this.inventoryService
      .getList()
      .subscribe((res) => {
        this.basicDataSource = res.content;
        this.columnSize = res.listSize;
        console.log(':: :: ', this.columnSize)
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
      this.inventoryService.setPageParams(this.pageParam);
      this.getList();
    }
  }

  setPageParams(pageParam: PageParam) {
    this.inventoryService.setPageParams(pageParam);
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

}
