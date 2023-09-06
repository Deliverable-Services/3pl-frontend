import { Component, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { Router } from "@angular/router";
import { InventoryService } from "src/app/@core/mock/inventory.service";
import { DialogService } from "ng-devui";
import { SortEventArg, ToastService } from "ng-devui";
import { PageParam, SearchParam } from "src/app/@core/data/searchFormData";
import { MSG } from "src/config/global-var";
import { ConnectionLocationService } from "src/app/@core/mock/connection-location.service";
import { InventoryOnlineService } from "src/app/@core/mock/inventory-online-data.service";

@Component({
  selector: "app-inventory-online",
  templateUrl: "./inventory-online.component.html",
  styleUrls: ["./inventory-online.component.scss"],
})
export class InventoryOnlineComponent implements OnInit {
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
    lgStoreOwnerId: "",
    sku: "",
  };
  pager = {
    total: 0,
    pageIndex: 1,
    pageSize: 10,
  };

  connectionLocations: any[] = [];

  columnSize: any = {
    title: "10%",
    dropdown: "10%",
    skuSearch: "10%",
    styleSearch: "10%",
    list: "10%",
    stockOwnerId: "7%",
    styleName: "12%",
    sku: "20%",
    // color: "6%",
    // size: "5%",
    warehouseId: "5%",
    wmsAvailableQty: "8%",
    wmsQcQty: "8%",
    wmsLockedQty: "8%",
    shpSohQty: "8%",
    shpAvlQty: "8%",
    shpCommittedQty: "8%",
    shpReservedQty: "8%",
  };

  constructor(
    private inventoryService: InventoryOnlineService,
    private connectionLocationService: ConnectionLocationService,
    private router: Router,
    private dialogService: DialogService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.getConnectionLocations();
    setTimeout(() => {
      this.pageParam.pageNo = 0;
      this.inventoryService.setPageParams(this.pageParam);
      this.getList();
    }, 1000);
  }

  getList(filterVal?: any) {
    console.log('filterVal', filterVal);
    
    this.busy = this.inventoryService
      .getList(filterVal || null)
      .subscribe((res) => {
        res.content.forEach((item: any) => {
          item.nodeName = this.basicDataSourceConnection[item.lgStoreOwnerId];
        });
        this.basicDataSource = res.content;

        // this.columnSize = res.listSize;
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
        this.connectionLocations.push({
          lgStoreOwnerId: "All",
          nodeName: "All",
        });
        // console.log(':: res ', res)
        res.forEach((data: any) => {
          this.basicDataSourceConnection[data.lgStoreOwnerId] = data.nodeName;
          if(data.nodeType == "Online")
            this.connectionLocations.push({
              lgStoreOwnerId: data?.lgStoreOwnerId || "",
              nodeName: data?.nodeName || "",
            });
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
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  setValue() {
    console.log("-------------->drop down s", this.dropdownSearch);

    if (this.dropdownSearch.lgStoreOwnerId === "All") {
      this.setSearch.stockOwnerId = "";
    } else {
      this.setSearch.stockOwnerId = this.dropdownSearch.lgStoreOwnerId;
    }
  }

  async startSearch(event: any) {
    await this.delay(500);
    const pattern =
      /^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/;
    let filterVal: any[] = [];
    Object.keys(this.setSearch)?.forEach((k: any) => {
      if (this.setSearch[k] !== "") {
        if (pattern.test(this.setSearch[k])) {
          filterVal.push({
            field: k,
            operator: "in",
            value: this.setSearch[k],
          });
        } else {
          filterVal.push({
            field: k,
            operator: "match",
            value: this.setSearch[k],
          });
        }
      }
    });
    this.getList(filterVal);
  }

  // syncShopify(): void {
  //   this._showPopUp('shopify');
  // }
  // syncWMS(): void {
  //   this._showPopUp('wms');
  // }

  // _showPopUp(type: string, fData?: any) {
  //   let checkPopup = this.dialogService.open({
  //     id: 'manage-confirmation',
  //     width: '350px',
  //     maxHeight: '600px',
  //     title: 'Are you sure you want to that?',
  //     backdropCloseable: false,
  //     content: '',
  //     showCloseBtn: false,
  //     dialogtype: 'warning',
  //     onClose: () => {
  //     },
  //     buttons: [
  //       {
  //         cssClass: 'primary',
  //         text: 'Ok',
  //         handler: ($event: Event) => {
  //           if (type === 'shopify') {
  //             this._showToast("success")
  //             this.inventoryService
  //               .syncShopify()
  //               .subscribe((res) => console.log(res));
  //           } else if (type === 'wms') {
  //             this._showToast("success")
  //             this.inventoryService
  //               .syncWMS()
  //               .subscribe((res) => console.log(res));
  //           }
  //           checkPopup.modalInstance.hide();
  //         },
  //       },
  //       {
  //         cssClass: 'info',
  //         text: 'Cancel',
  //         handler: ($event: Event) => {
  //           checkPopup.modalInstance.hide();
  //         },
  //       },
  //     ],
  //   });
  // }

  // _showToast(resp: any) {
  //   let type, msg;
  //   if (resp) {
  //     type = 'success';
  //     msg = MSG.update;
  //   } else {
  //     type = 'error';
  //     msg = MSG.error;
  //   }
  //   this.toastService.open({
  //     value: [
  //       { severity: type, content: msg },
  //     ],
  //     life: 2000,
  //   });
  // }
}
