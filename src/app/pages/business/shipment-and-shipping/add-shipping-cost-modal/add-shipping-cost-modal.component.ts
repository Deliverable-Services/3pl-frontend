import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { CurrencyDataService } from "src/app/@core/mock/currency-data.service";
import { CreditTermsService } from 'src/app/@core/mock/credit-terms.service';

@Component({
  selector: "app-add-shipping-cost-modal",
  templateUrl: "./add-shipping-cost-modal.component.html",
  styleUrls: ["./add-shipping-cost-modal.component.scss"],
})
export class AddShippingCostModalComponent implements OnInit {
  @Input() data: any;
  @Input() handler: Function;
  @Output() modalClosed = new EventEmitter<any>();

  defaultInputs: any = {
    type: "",
    description: "",
    costPrice: "",
    currency: "",
    terms: {}
  }

  formArray: any[] = [];

  currencyList: any[] = [];
  currencyData: any[] = [];

  pageParam: any = {
    pageNo: "",
    pageSize: "",
    sortBy: "",
    sortDir: "",
  };

  pager = {
    total: 0,
    pageIndex: 1,
    pageSize: 10,
  };

  creditTermsData: any[] = [];

  constructor(
    private currencyDataService: CurrencyDataService,
    private creditTermsService: CreditTermsService,
  ) {
    this.handler = () => {}; // Initialize the handler with a default empty function
  }

  ngOnInit(): void {
    this.formArray.push({
      type: "",
      description: "",
      costPrice: "",
      currency: "",
      terms: {}
    });
    this.getCurrencyListActive();

    this.pageParam.pageSize = 100;
    this.pager.pageSize = 100;
    this.creditTermsService.setPageParams(this.pageParam);
    this.getCreditTermsList();
  }

  close($event: any) {
    this.modalClosed.emit();
    this.handler($event);
  }

  storeObjectData(obj: any) {
    this.data.vList();
  }

  updateValue(event: any, keyName: string, index: number) {
    this.formArray[index][keyName] = event.target.value;
  }

  removeNow(rowIndex: number) {
    this.formArray?.splice(rowIndex,1);
  }

  addMore() {
    this.formArray.push({
      type: "",
      description: "",
      costPrice: "",
      currency: "",
      terms: {}
    });
  }

  numberOnly(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  getCurrencyListActive() {
    this.currencyDataService
      .getCurrencyListActive({ perPage: 100 })
      .subscribe((res: any) => {
        this.currencyData = res.content;
        this.currencyList = res.content.map((el: any) => {
          return el.currencyCode;
        });
      });
  }

  getCreditTermsList() {
    this.creditTermsService
      .getList()
      .subscribe((res) => {
        this.creditTermsData = res.content;
      });
  }

}
