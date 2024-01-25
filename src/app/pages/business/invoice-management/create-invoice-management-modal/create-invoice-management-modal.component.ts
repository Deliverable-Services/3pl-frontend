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
  dValue:any;
  poList: any[] = [];
  formInfo:any = {
    type: "",
    poId: ""
  }
  allowedStatus:any[] = ['ACCEPTED', 'CLOSED', 'CONFIRMED', 'READY', 'RELEASED'];
  depositDisable:boolean = false;
  preDisable:boolean = false;
  finalDisable:boolean = false;

  constructor(
    private purchaseOrderService: PurchaseOrderService
  ) {
    this.handler = () => {}; // Initialize the handler with a default empty function
  }

  ngOnInit(): void {
    this._getPoList();
  }

  _getPoList() {
    this.purchaseOrderService.getPurchaseOrderListActive({ perPage: 100 }).subscribe((p: any) => {
      this.poList = p?.content?.map((po: any) => {
        // console.log(':: po :: ', po.orderStatus, po.sampleStatus);
        return {
          ...po,
          toDisplay: po?.id+' - '+po?.vendor.companyName
        }
      });
      this.poList = this.poList?.filter((po: any) => {
        // console.log(po?.orderStatus, this.allowedStatus, this.allowedStatus?.indexOf(po?.orderStatus));
        return this.allowedStatus?.indexOf(po?.orderStatus) > -1;
      });
    })
  }

  close($event: any) {
    this.modalClosed.emit(this.variantList);
    this.handler($event);
  }

  checkPo() {
    this.purchaseOrderService.getById(this.formInfo.poId).subscribe((po: any) => {
      // console.log(':: :: ', po?.invoices);
      if(!po?.invoices) {
        this.formInfo.type = 'DEPOSIT';
        this.depositDisable = false;
        this.preDisable = true;
        this.finalDisable = true;
      } else if(po?.invoices?.length) {
        let getPre = po?.invoices?.filter((invoice: any) => invoice?.type?.toLowerCase() === 'mid');
        let getFinal = po?.invoices?.filter((invoice: any) => invoice?.type?.toLowerCase() === 'final');

        if(getFinal.length) {
          this.depositDisable = true;
          this.preDisable = true;
          this.finalDisable = true;
        }

        if(po?.invoices?.filter((invoice: any) => invoice?.type?.toLowerCase() === 'deposit')?.length) {
          this.depositDisable = true;
        }
        if(!getPre?.length && !getFinal?.length) {
          this.preDisable = false;
          this.finalDisable = true;
          this.formInfo.type = 'MID';
        } else if(getPre?.length && !getFinal?.length) {
          this.preDisable = false;
          this.finalDisable = false;
          this.formInfo.type = 'MID';
        }
      }
      this.data.vList(this.formInfo);
    });
  }

  updateFormInfo() {
    this.data.vList(this.formInfo);
  }
}
