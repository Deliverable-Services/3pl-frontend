import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";
import {
  DialogService,
  FormLayout,
  SortEventArg,
  TableWidthConfig,
} from "ng-devui";
import { Subscription } from "rxjs";
import { Brand } from "src/app/@core/data/brandList";
import { PageParam, SearchParam } from "src/app/@core/data/searchFormData";
import { ShipmentDataService } from "src/app/@core/mock/shipment-data.service";

@Component({
  selector: "app-shipment-list",
  templateUrl: "./shipment-list.component.html",
  styleUrls: ["./shipment-list.component.scss"],
})
export class ShipmentListComponent implements OnInit {
  filterAreaShow = false;
  isAdd: string = "ADD";
  editForm: any = null;
  editRowIndex = -1;

  pageParam: any = {
    pageNo: "",
    pageSize: "",
    sortBy: "",
    sortDir: "",
  };

  searchWithShipmentRefName: SearchParam = {
    keyword: "",
    sort: "asc",
    columnName: "shipRef",
    searchType: "match",
  };

  pager = {
    total: 0,
    pageIndex: 1,
    pageSize: 10,
  };

  busy: Subscription | undefined;
  basicDataSource: any;

  constructor(
    private shipmentDataService: ShipmentDataService,
    private dialogService: DialogService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.getShipmentList();
  }

  getShipmentList() {
    this.busy = this.shipmentDataService
      .getShipmentList()
      .subscribe((res: any) => {
        this.basicDataSource = res.content;
        this.pager.total = res.totalItems;
      });
  }

  editShipment(rowId: any, index: number) {
    this.isAdd = "EDIT";
    this.editRowIndex = index;
    console.log({ rowId });
    this.router.navigate([`/operation/shipment/edit/${rowId}`]);
  }

  // addPackage(rowId: any, index: number) {
  //   this.router.navigate([`/operation/shipment/package/add/${rowId}`]);
  // }

  deleteShipment(index: number) {
    const results = this.dialogService.open({
      id: "delete-dialog",
      width: "346px",
      maxHeight: "600px",
      title: "Delete",
      showAnimate: false,
      content: "Are you sure you want to delete it?",
      backdropCloseable: true,
      onClose: () => {},
      buttons: [
        {
          cssClass: "primary",
          text: "Ok",
          disabled: false,
          handler: ($event: Event) => {
            this.basicDataSource.splice(index, 1);
            results.modalInstance.hide();
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

  setSearchParams(searchParam: SearchParam) {
    this.shipmentDataService.setSearchParams(searchParam);
    this.getShipmentList();
  }

  setPageParams(pageParam: PageParam) {
    this.shipmentDataService.setPageParams(pageParam);
    this.getShipmentList();
  }

  onPageChange(e: number) {
    this.pager.pageIndex = e;
    this.pageParam.pageNo = this.pager.pageIndex - 1;
    this.setPageParams(this.pageParam);
    this.getShipmentList();
  }

  onSizeChange(e: number) {
    this.pager.pageSize = e;
    this.pageParam.pageSize = e;
    this.setPageParams(this.pageParam);
    this.getShipmentList();
  }

  search(e: any, searchParam: SearchParam) {
    searchParam.keyword = e.target.value;
    this.setSearchParams(searchParam);
    this.getShipmentList();
  }

  multiSortChange(e: SortEventArg[]) {
    if (e.length === 1) {
      this.pageParam.sortBy = e[0].field;
      this.pageParam.sortDir = e[0].direction.toLowerCase();
      this.shipmentDataService.setPageParams(this.pageParam);
      this.getShipmentList();
    }
  }
}
