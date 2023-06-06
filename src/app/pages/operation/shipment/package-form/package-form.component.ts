import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute, Params, Route, Router } from "@angular/router";
import { DFormGroupRuleDirective, DialogService, FormLayout } from "ng-devui";
import { Observable, Subscription, of, forkJoin } from "rxjs";
import { POHeader } from "src/app/@core/data/poHeaderList";
import { ShipmentCostData } from "src/app/@core/data/shipmentCostList";
import { ShipmentDetailData } from "src/app/@core/data/shipmentDetailList";
import { ShipmentHeader } from "src/app/@core/data/shipmentHeaderList";
import { PoDataService } from "src/app/@core/mock/po-data.service";
import { ShipmentDataService } from "src/app/@core/mock/shipment-data.service";
import { FormConfig } from "src/app/@shared/components/admin-form";
import { __values } from "tslib";

@Component({
  selector: "app-package-form",
  templateUrl: "./package-form.component.html",
  styleUrls: ["./package-form.component.scss"],
})
export class PackageFormComponent implements OnInit {
  @Input() data: any;

  packageFormData = {
    ctnCode: "",
    ctnNo: "",
    widthCm: 0,
    heightCm: 0,
    lengthCm: 0,
    grossWeightKg: 0,
    netWeightKg: 0,
    boxSize: 0,
    details: {},
  };

  packageDetailList: any = [];

  mode: string = "Add";
  paramId: string = "";

  shipmentDetailList: ShipmentDetailData[] = [];

  busy: Subscription | undefined;
  type: any;
  constructor(
    private dialogService: DialogService,
    private router: Router,
    private route: ActivatedRoute,
    private shipmentDataService: ShipmentDataService,
    private poDataService: PoDataService
  ) {}

  ngOnInit() {
    this.paramId = this.data.paramId;
    this.type = this.data.type;
    this.getShipmentById(this.paramId);
  }

  getShipmentById(paramId: string) {
    this.shipmentDataService.getShipmentById(paramId).subscribe((res) => {
      this.shipmentDetailList = res.shipmentDetails;
    });
  }

  verticalLayout: FormLayout = FormLayout.Vertical;

  submitPackageForm(event: Event) {
    const details = this.packageDetailList.map((data: any) => {
      return {
        productSka: data.productSka,
        packageQty: data.packageQty,
      };
    });
    this.shipmentDataService
      .addPackage({ ...this.packageFormData, details: details }, this.paramId)
      .subscribe(() => {});
  }

  packageDetailChangeHandler(event: Event, index: any) {}

  removePackageDetail(index: any) {
    this.packageDetailList.splice(index, 1);
  }

  addPackageDetailInput() {
    let obj = {
      productSku: "",
      packageQty: "",
    };
    this.packageDetailList.push(obj);
  }

  setPackageQtyCheck() {
    let returnVal;
    this.type === "single"
      ? (returnVal = {
          validators: [
            { required: true },
            {
              custom: (value: any) => {
                console.log(value);
                console.log(this.packageFormData.boxSize);
                console.log(value % this.packageFormData.boxSize);

                if (value % this.packageFormData.boxSize !== 0) {
                  return "Package qty should be divisable by box qty";
                } else {
                  return null;
                }
              },
            },
          ],
        })
      : (returnVal = {
          validators: [],
      });
    
    return returnVal;
  }
}
