import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormLayout } from "ng-devui";
import { PoDataService } from "src/app/@core/mock/po-data.service";

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
    po: {
      poId: "",
    },
    poDetail: {
      poDetailId: "",
      vendorPrice: "",
      productSku: "",
      poQty: "",
      shippedQty: "",
    },
  };
  poList: any = [];
  poDetailList: any = [];

  constructor(private poDataService: PoDataService) {}

  ngOnInit(): void {
    this.getPOList();
  }

  submitShipmentDetail({ valid }: { valid: boolean }) {
    if (valid) {
      this.data.returnData({
        poId: this.shipmentDetailFormData.po.poId,
        poDetailId: this.shipmentDetailFormData.poDetail.poDetailId,
        productSku: this.shipmentDetailFormData.poDetail.productSku,
        shipQty: this.shipmentDetailFormData.poDetail.shippedQty,
      });
    } else {
      this.data.returnData(undefined);
    }
  }

  cancel() {
    this.data.close();
  }

  getPOList() {
    this.poDataService.getPOList().subscribe((res: any) => {
      this.poList = res.content;
    });
  }

  getPOById() {
    console.log(this.shipmentDetailFormData);
    this.poDataService
      .getPOById(this.shipmentDetailFormData.po.poId)
      .subscribe((res) => {
        this.poDetailList = res.poDetail;
      });
  }
}
