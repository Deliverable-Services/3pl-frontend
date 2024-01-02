import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { Router } from "@angular/router";
import {
  SortEventArg,
  TableWidthConfig,
  ToastService,
  DialogService,
} from "ng-devui";
import { Subscription } from "rxjs";
import { PageParam, SearchParam } from "src/app/@core/data/searchFormData";
import { InvoiceManagementService } from "src/app/@core/mock/invoice-management.service";
import { CreateInvoiceManagementModalComponent } from "../create-invoice-management-modal/create-invoice-management-modal.component";

@Component({
  selector: "app-invoice-management-list",
  templateUrl: "./invoice-management-list.component.html",
  styleUrls: ["./invoice-management-list.component.scss"],
})
export class InvoiceManagementListComponent implements OnInit {
  filterAreaShow = false;
  isAdd: string = "ADD";

  pageParam: any = {
    pageNo: "",
    pageSize: "",
    sortBy: "",
    sortDir: "",
  };

  selectStyle = { width: "calc(100% - 53%)", float: "right", margin: "-2px" };

  isAddSession: boolean = true;
  @Output() checked = new EventEmitter();

  tableWidthConfig: TableWidthConfig[] = [];

  formData = {};

  basicDataSource: any[] = [];

  editForm: any = null;

  editRowIndex = -1;
  statusList: any[] = ["ALL", "DRAFT", "OPEN", "RELEASED", "CLOSED","ACCEPT"];

  pager = {
    total: 0,
    pageIndex: 1,
    pageSize: 10,
    sortDir: "desc",
    sortBy: "id",
  };

  searchKeywords: any = {
    id: "",
    orderStatus: "",
  };

  columnSize: any = {
    id: "10%",
    type: "20%",
    poId: "10%",
    vendor: "10%",
    shipToLocation: "10%",
    status: "10%",
    createdBy: "40%",
    createdDate: "40%",
    action: "10%",
    active: "10%",
  };

  busy: Subscription | undefined;

  config = {
    id: "dialog-service",
    width: "40%",
    maxHeight: "600px",
    content: CreateInvoiceManagementModalComponent,
    backdropCloseable: true,
    onClose: () => console.log(""),
    data: {},
  };

  constructor(
    private cService: InvoiceManagementService,
    private toastService: ToastService,
    private dialogService: DialogService,
    // protected modalService: NgbModal,
    private router: Router
  ) {}

  ngOnInit() {
    this.pageParam.pageSize = 50;
    this.pager.pageSize = 50;
    this.pager.sortBy = "id";
    this.pager.sortDir = "id";
    this.pageParam.sortDir = "desc";
    this.pageParam.sortDir = "desc";

    this.pageParam.pageNo = 0;
    this.cService.setPageParams(this.pageParam);
    this.getList();
  }

  getList(searchParams?: any) {
    this.busy = this.cService
      .getList(searchParams)
      .subscribe((res) => {
        this.basicDataSource = res.content;
        this.pager.total = res.totalItems;
      });
  }

  setSearchParams(searchParam: SearchParam) {
    // this.PurchaseOrderListDataService.setSearchParams(searchParam);
    this.getList();
  }

  setPageParams(pageParam: PageParam) {
    this.cService.setPageParams(pageParam);
    this.getList();
  }

  editRow(rowId: any, index: number) {
    this.isAdd = "EDIT";
    this.editRowIndex = index;
    this.router.navigate([`/business/invoice-management/edit/${rowId}`]);
  }

  deleteRow(rowId: any, index: number) {
    this.busy = this.cService
      .delete(rowId)
      .subscribe((res) => {
        // console.log(':: res :: ', res);
        // let s;
        // let msg;
        // if(res) {
        //   s = 'success';
        //   msg = 'Transfer Order Deleted Successfully!';
        //   this.getList();
        // } else {
        //   s = 'error';
        //   msg = MSG.error;
        // }

        this.getList();
        this.toastService.open({
          value: [
            {
              severity: "success",
              content: "Purchase Order Deleted Successfully!",
            },
          ],
          life: 2000,
        });
      });
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

  startSearch(event: any) {
    let newSearchParams: any = {
      filters: [],
    };
    setTimeout(() => {
      Object.keys(this.searchKeywords).forEach((field) => {
        console.log("field", field);
        if (this.searchKeywords[field] != "ALL") {
          if (this.searchKeywords[field]) {
            newSearchParams.filters.push({
              field: field,
              operator: "match",
              value: this.searchKeywords[field],
            });
          }
        }
      });

      this.getList(newSearchParams);
    }, 500);
  }

  multiSortChange(e: SortEventArg[]) {
    if (e.length === 1) {
      this.pageParam.sortBy = e[0].field;
      this.pageParam.sortDir = e[0].direction.toLowerCase();
      this.cService.setPageParams(this.pageParam);
      this.getList();
    }
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

  createInvoice(dialogtype?: string, showAnimation?: boolean) {
    const results = this.dialogService.open({
      ...this.config,
      dialogtype: dialogtype,
      showAnimation: showAnimation,
      buttons: [
        {
          cssClass: "primary",
          text: "Create",
          disabled: false,
          handler: (variantList: any) => {

            this.cService.create({dto: this.formData}).subscribe((invoice: any) => {
              console.log(':: :: ', invoice);
              results.modalInstance.hide();
              this.router.navigate([`/business/invoice-management/edit/${invoice.id}`]);
            })
          },
        }
      ],
      data: {
        vList: (vData: any) => {
          console.log(':: :: ', vData);
          this.formData = vData;
        },
      },
    });
  }
}
