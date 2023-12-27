import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { PurchaseOrderService } from "src/app/@core/mock/purchase-order.service";

@Component({
  selector: "app-create-invoice-management-modal",
  templateUrl: "./create-invoice-management-modal.component.html",
  styleUrls: ["./create-invoice-management-modal.component.scss"],
})
export class CreateInvoiceManagementModalComponent implements OnInit {
  @Input() data: any;
  @Input() handler: Function;
  @Output() modalClosed = new EventEmitter<any>();

  filteredData: any[] = [];
  variantList: any[] = [];
  selectedVariants: any[] = [];
  cartItems: any[] = [];
  exwSgdCost: any;
  searchWithStyleName: any = {
    keyword: "",
    sort: "asc",
    columnName: "styleName",
    searchType: "match",
  };
  poList: any[] = [];

  constructor(
    private purchaseOrderService: PurchaseOrderService
  ) {
    this.handler = () => {}; // Initialize the handler with a default empty function
  }

  ngOnInit(): void {
    this.purchaseOrderService.getPurchaseOrderListActive().subscribe((p: any) => {
      this.poList = p?.map((po: any) => {
        return {
          ...po,
          toDisplay: po?.id+' - '+po?.vendor.companyName
        }
      })
    })
  }

  close($event: any) {
    this.modalClosed.emit(this.variantList);
    this.handler($event);
  }

  getPurchaseOrdeList() {

  }
}
