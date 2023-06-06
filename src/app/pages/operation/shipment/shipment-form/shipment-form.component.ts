import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { ActivatedRoute, Params, Route, Router } from "@angular/router";
import { DFormGroupRuleDirective, DialogService, FormLayout } from "ng-devui";
import { Observable, Subscription, of, forkJoin } from "rxjs";
import { POHeader } from "src/app/@core/data/poHeaderList";
import { ShipmentCostData } from "src/app/@core/data/shipmentCostList";
import { ShipmentDetailData } from "src/app/@core/data/shipmentDetailList";
import { ShipmentHeader } from "src/app/@core/data/shipmentHeaderList";
import { TradeTerm } from "src/app/@core/data/tradeTermList";
import { PoDataService } from "src/app/@core/mock/po-data.service";
import { ShipmentDataService } from "src/app/@core/mock/shipment-data.service";
import { TradeListDataService } from "src/app/@core/mock/Trade-data.service";
import { FormConfig } from "src/app/@shared/components/admin-form";
import { PackageFormComponent } from "../package-form/package-form.component";

@Component({
  selector: "app-shipment-form",
  templateUrl: "./shipment-form.component.html",
  styleUrls: ["./shipment-form.component.scss"],
})
export class ShipmentFormComponent implements OnInit {
  @ViewChild("ShipmentCostDialog", { static: true })
  ShipmentCostDialog: TemplateRef<any> | undefined;

  shipmentFormData = {
    shipRef: "",
    remarks: "",
    status: "",
    createdAt: "",
    updatedAt: "",
  };

  mode: string = "Add";
  paramId: string = "";

  shipmentHeaderList: ShipmentHeader[] = [];
  shipmentDetailList: ShipmentDetailData[] = [];
  shipmentCostList: ShipmentCostData[] = [];
  poList: POHeader[] = [];

  tradeTermList: TradeTerm[] = [];
  formData = {};
  formData1 = {};

  editForm: any = null;

  formEditFlag: boolean = true;

  formConfig!: FormConfig;
  packageHeaderList: any;
  status!: string;

  onCanceled() {
    this.editForm!.modalInstance.hide();
  }

  onSubmitted(e: any) {
    console.log(e);
    this.shipmentCostList.push({
      ...e,
      terms: e.tradeDesc.tradeDesc,
    });
    this.editForm!.modalInstance.hide();
  }

  addShipmentLine(e: Event) {
    console.log(e + "event");
  }

  busy: Subscription | undefined;
  constructor(
    private dialogService: DialogService,
    private router: Router,
    private route: ActivatedRoute,
    private shipmentDataService: ShipmentDataService,
    private poDataService: PoDataService,
    private tradeTermServices: TradeListDataService
  ) {}

  ngOnInit() {
    this.paramId = this.route.snapshot.params["id"];
    this.mode = this.route.snapshot.params["id"] ? "Edit" : "Add";
    if (this.mode === "Edit") {
      this.getShipmentById(this.paramId);
    }
    this.getTradeTermList();
  }

  getTradeTermList() {
    this.tradeTermServices.getTradeList().subscribe((res: any) => {
      this.tradeTermList = res.content;

      this.formConfig = {
        layout: FormLayout.Horizontal,
        items: [
          {
            label: "Cost Type",
            prop: "costType",
            type: "input",
            required: true,
            rule: {
              validators: [{ required: true }],
            },
          },
          {
            label: "Description",
            prop: "description",
            type: "input",
            required: true,
            rule: {
              validators: [{ required: true }],
            },
          },
          {
            label: "Cost Price",
            prop: "costPrice",
            type: "input",
            required: true,
            rule: {
              validators: [{ required: true }],
            },
          },
          {
            label: "Currency",
            prop: "currency",
            type: "input",
            required: true,
            rule: {
              validators: [{ required: true }],
            },
          },
          {
            label: "Term",
            prop: "tradeDesc",
            name: "term",
            type: "select",
            options: this.tradeTermList,
            required: true,
            rule: {
              validators: [{ required: true }],
            },
          },
        ],

        labelSize: "",
      };
    });
  }

  getShipmentById(paramId: string) {
    this.shipmentDataService.getShipmentById(paramId).subscribe((res) => {
      this.shipmentFormData = res;
      this.status = this.shipmentFormData.status;
      this.shipmentCostList = res.shippingCosts;
      this.shipmentDetailList = res.shipmentDetails;
      this.packageHeaderList = res.packageHeaders;
    });
  }

  verticalLayout: FormLayout = FormLayout.Vertical;

  getValue(value: object) {
    console.log(value);
  }

  getPoList() {
    this.poDataService.getPOList();
  }

  addPackage(type: string) {
    this.editForm = this.dialogService.open({
      id: "add-dialog",
      width: "800px",
      title: "Add Package",
      showAnimate: false,
      content: PackageFormComponent,
      data: {
        paramId: this.paramId,
        type: type,
        returnData: () => {
          this.editForm!.modalInstance.hide();
          window.location.reload();
        },
      },
      backdropCloseable: true,
      onClose: () => {},
      buttons: [],
    });
  }

  submitShipmentForm({ valid, directive, data, errors }: any) {
    if (valid) {
      let data;
      if (this.mode === "Add") {
        data = {
          shipRef: this.shipmentFormData.shipRef,
          remarks: this.shipmentFormData.remarks,
        };
        this.shipmentDataService.addShipment(data).subscribe((data) => {
          this.router.navigate(["/operation/shipment"]);
        });
      } else {
        data = {
          shipRef: this.shipmentFormData.shipRef,
          remarks: this.shipmentFormData.remarks,
          shippingCosts: this.shipmentCostList,
          shipmentDetails: this.shipmentDetailList,
        };
        this.shipmentDataService
          .updateShipment(this.paramId, data)
          .subscribe((data) => {
            this.getShipmentById(this.paramId);
          });
      }
    } else {
    }
  }

  changeShipmentToSubmit() {
    const data = {
      shipRef: this.shipmentFormData.shipRef,
      remarks: this.shipmentFormData.remarks,
      shippingCosts: this.shipmentCostList,
      shipmentDetails: this.shipmentDetailList,
    };
    this.shipmentDataService
      .changeShipmentToSubmit(this.paramId, data)
      .subscribe((data) => {
        this.getShipmentById(this.paramId);
      });
  }

  changeShipmentToConfirm() {
    this.shipmentDataService
      .changeShipmentToConfirm(this.paramId)
      .subscribe((data) => {
        this.getShipmentById(this.paramId);
      });
  }

  changeShipmentToDispatched() {
    this.shipmentDataService
      .changeShipmentToDispatched(this.paramId)
      .subscribe((data) => {
        this.getShipmentById(this.paramId);
      });
  }

  changeShipmentToPartial() {
    this.shipmentDataService
      .changeShipmentToPartial(this.paramId)
      .subscribe((data) => {
        this.getShipmentById(this.paramId);
      });
  }

  changeShipmentToFull() {
    this.shipmentDataService
      .changeShipmentToFull(this.paramId)
      .subscribe((data) => {
        this.getShipmentById(this.paramId);
      });
  }

  addShipmentCost() {
    this.editForm = this.dialogService.open({
      id: "add-dialog",
      width: "600px",
      maxHeight: "600px",
      title: "Add Shipment Cost item",
      showAnimate: false,
      contentTemplate: this.ShipmentCostDialog,
      backdropCloseable: true,
      onClose: () => {},
      buttons: [],
    });
  }

  deleteShipmentDetail(id: number) {
    this.shipmentDetailList.splice(id, 1);
  }

  deleteShipmentCost(id: number) {
    this.shipmentCostList.splice(id, 1);
  }
}
