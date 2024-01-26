import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { PurchaseOrderService } from "src/app/@core/mock/purchase-order.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-invoice-management-form-modal",
  templateUrl: "./invoice-management-form-modal.component.html",
  styleUrls: ["./invoice-management-form-modal.component.scss"],
})
export class InvoiceManagementFormModalComponent implements OnInit {
  @Input() data: any;
  @Input() handler: Function;
  @Output() modalClosed = new EventEmitter<any>();
  invoiceList: any[] = [];

  constructor(
    private router: Router,
    private purchaseOrderService: PurchaseOrderService
  ) {
    this.handler = () => {}; // Initialize the handler with a default empty function
  }

  ngOnInit(): void {
    this.purchaseOrderService.getById(this.data.details.poId).subscribe((po: any) => {
      this.invoiceList = po?.invoices;
    })
  }

  close($event: any) {
    this.handler($event);
  }

  editRow(rowId: any, index: number) {
    this.router.navigate([`/business/invoice-management/edit/${rowId}`]);
  }
}
