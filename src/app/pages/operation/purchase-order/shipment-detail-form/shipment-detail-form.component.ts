import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormLayout } from "ng-devui";
import { PoDataService } from "src/app/@core/mock/po-data.service";
import { ShipmentDataService } from "src/app/@core/mock/shipment-data.service";

@Component({
  selector: "app-shipment-detail-form",
  templateUrl: "./shipment-detail-form.component.html",
  styleUrls: ["./shipment-detail-form.component.scss"],
})
export class ShipmentDetailFormComponent implements OnInit {
  @Input() data: any;

  layout = FormLayout.Horizontal;
  labelSize = "";

  shipmentDetailFormData = {
    shipment: {
      shipmentDetails: "",
    },
    selectedShipment: {
      shipmentId: "",
    },
    selectedPoLines: [],
  };

  selectedPoLines: any[] = [];
  selectedPoLinesArray: any[] = [];
  shipmentList: any = [];
  poLineItemList: any;

  verticalLayout: FormLayout = FormLayout.Vertical;

  constructor(
    private shipmentDataService: ShipmentDataService,
    private poDataService: PoDataService
  ) {}

  ngOnInit(): void {
    this.getShipmentList();
    this.getPOHeaderById(this.data.detail.poId);
  }

  getShipmentList() {
    this.shipmentDataService.getShipmentList().subscribe((res: any) => {
      this.shipmentList =
        res.content.length > 0
          ? res.content.filter((data: any) => data.status === "Draft")
          : [];
    });
  }

  getShipmentById(paramId: string) {
    this.shipmentDataService.getShipmentById(paramId).subscribe((res) => {
      this.shipmentDetailFormData.shipment = res;
    });
  }

  submitShipmentDetail({ valid }: { valid: boolean }) {
    if (valid) {
      this.shipmentDataService
        .updateShipment(
          this.shipmentDetailFormData.selectedShipment.shipmentId,
          {
            ...this.shipmentDetailFormData.shipment,
            shipmentDetails: [
              ...this.shipmentDetailFormData.shipment.shipmentDetails,
              ...this.selectedPoLinesArray.map((poLine: any) => {
                return {
                  poId: poLine.poId,
                  poDetailsId: poLine.poDetailId,
                  productSku: poLine.productSku,
                  shipQty: poLine.shipQty,
                };
              }),
            ],
          }
        )
        .subscribe((data) => {
          this.data.close();
        });
      console.log(this.shipmentDetailFormData.shipment);
    } else {
    }
    // this.data.close();
  }

  cancel() {
    this.data.close();
  }

  getPOHeaderById(paramId: string) {
    this.poDataService.getPOById(paramId).subscribe((res) => {
      this.poLineItemList = res.poDetail.length > 0 ? res.poDetail : [];
    });
  }

  updatePoLinesArray() {
    this.selectedPoLinesArray = this.selectedPoLinesArray.filter(
      (selectedPoLine: any) => {
        this.selectedPoLines.find((poLine: any) => {
          return selectedPoLine.productSku === poLine.productSku;
        });
      }
    );

    this.selectedPoLines.map((selectedPoLine: any) => {
      const index = this.selectedPoLinesArray.findIndex((poLine: any) => {
        return selectedPoLine.productSku === poLine.productSku;
      });
      if (index === -1) {
        this.selectedPoLinesArray.push(selectedPoLine);
      }
    });
  }

  removeSelectedPoLine(index: number) {
    this.selectedPoLinesArray.splice(index, 1);
    this.selectedPoLines = this.selectedPoLinesArray;
  }

  setShipQtyValidatory(index: number) {
    return {
      validators: [
        { required: true },
        {
          max: this.selectedPoLinesArray[index].poQty,
          message: "Shipped qty cannot be more then PO Qty",
        },
      ],
    };
  }
}
