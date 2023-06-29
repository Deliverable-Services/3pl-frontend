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
import { ConnectionLocationService } from 'src/app/@core/mock/connection-location.service';

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
  connectionLocation: Subscription | undefined;
  basicDataSource: any[] = [];
  basicDataSourceConnection: any[] = [];
  dropdownSearch: any;
  setSearch: any = {
    connectionLocationId: "",
    sku: "",
    styleName: ""
  }
  pager = {
    total: 0,
    pageIndex: 1,
    pageSize: 10,
  };

  connectionLocations: any[] = [];

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
    private connectionLocationService: ConnectionLocationService,
    private router: Router,
    private toastService: ToastService,
  ) { }

  ngOnInit(): void {
    this.getConnectionLocations();
    setTimeout(() => {
      this.getList();
    },1000)
  }

  getList(filterVal?: any) {
    this.busy = this.inventoryService
      .getList(filterVal || null)
      .subscribe((res) => {
        res.content.forEach((item:any) => {
          item.nodeName = this.basicDataSourceConnection[item.connectionLocationId]
        });
        this.basicDataSource = res.content;
        
        this.columnSize = res.listSize;
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

  getConnectionLocations() {
    this.connectionLocation = this.connectionLocationService
      .getList()
      .subscribe((res) => {
        this.connectionLocations = [];
        // console.log(':: res ', res)
       res.forEach((data:any) => {
          this.basicDataSourceConnection[data.connectionLocationId] = data.nodeName;
          this.connectionLocations.push({
            connectionLocationId: data?.connectionLocationId || '',
            nodeName: data?.nodeName || ''
          })
        });
        
        this.pager.total = res.totalItems;
        // Object.keys(res.listSize).map((key) => {
        //   let widthValue = res.listSize[key] + "%";
        //   this.columnSize[key] = widthValue;
        // });
      });
  }

  onSizeChange(e: number) {
    this.pager.pageSize = e;
    this.pageParam.pageSize = e;
    this.setPageParams(this.pageParam);
    this.getList();
  }

  //set delay for next process
  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  setValue() {
    this.setSearch.connectionLocationId = this.dropdownSearch.connectionLocationId;
  }

  async startSearch(event: any) {
    await this.delay(500);
    let filterVal: any[] = [];
    Object.keys(this.setSearch)?.forEach((k: any) => {
      if(this.setSearch[k] !== '') {
        filterVal.push({
          field: k,
          operator: "match",
          value: this.setSearch[k],
        })
      }
    });
    this.getList(filterVal);
  }

}
