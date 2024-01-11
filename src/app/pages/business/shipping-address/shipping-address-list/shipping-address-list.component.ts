import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from "@angular/router";
import { ShippingAddressService } from 'src/app/@core/mock/shipping-address.service';
import {
  SortEventArg,
  ToastService,
  DialogService
} from "ng-devui";
import { PageParam, SearchParam } from "src/app/@core/data/searchFormData";
import { MSG } from 'src/config/global-var';

@Component({
  selector: 'app-shipping-address-list',
  templateUrl: './shipping-address-list.component.html',
  styleUrls: ['./shipping-address-list.component.scss']
})
export class ShippingAddressListComponent implements OnInit {

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
    private $service: ShippingAddressService,
    private router: Router,
    private toastService: ToastService,
    private dialogService: DialogService
  ) { }

  ngOnInit(): void {
    this.pageParam.pageSize = 50;
    this.pager.pageSize = 50;
    this.$service.setPageParams(this.pageParam);
    this.getCreditTermsList();
  }

  getCreditTermsList() {
    this.busy = this.$service
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
      this.$service.setPageParams(this.pageParam);
      this.getCreditTermsList();
    }
  }

  setPageParams(pageParam: PageParam) {
    this.$service.setPageParams(pageParam);
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
    this.router.navigate([`/business/shipping-address/edit/${rowId}`]);
  }

  confirmDialog(rowId: any, index: number) {
    let stRowId = rowId;
    let stIndex = index;
    const results = this.dialogService.open({
      id: "dialog-service",
      width: "346px",
      maxHeight: "600px",
      title: "Are you sure?",
      content: "",
      backdropCloseable: true,
      dialogtype: "",
      onClose: () => {},
      buttons: [
        {
          cssClass: "primary",
          text: "Ok",
          disabled: false,
          handler: ($event: Event) => {
            results.modalInstance.hide();
            this.deleteRow(stRowId, stIndex);
          },
        },
        {
          id: "btn-cancel",
          cssClass: "common",
          text: "Cancel",
          handler: ($event: Event) => {
            results.modalInstance.hide();
          },
        },
      ],
    });
  }

  deleteRow(rowId: any, index: number) {
    this.busy = this.$service
      .delete(rowId)
      .subscribe((res) => {
        this.getCreditTermsList();
        this.toastService.open({
          value: [
            {
              severity: "success",
              content: "Shiping Address Deleted Successfully!",
            },
          ],
          life: 2000,
        });
      });
  }

}
