import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { ActivatedRoute, Params, Route, Router } from "@angular/router";
import { DFormGroupRuleDirective, DialogService, FormLayout } from "ng-devui";
import { Observable, Subscription, of } from "rxjs";
import { Company } from "src/app/@core/data/companyList";
import { Department } from "src/app/@core/data/departmentList";
import { poLineItem } from "src/app/@core/data/poLineItemList";
import { TradeTerm } from "src/app/@core/data/tradeTermList";
import { Vendor } from "src/app/@core/data/vendorList";
import { CompanyDataService } from "src/app/@core/mock/company-data.service";
import { DepartmentDataService } from "src/app/@core/mock/department-data.service";
import { PoDataService } from "src/app/@core/mock/po-data.service";
import { TradeListDataService } from "src/app/@core/mock/Trade-data.service";
import { VendorListDataService } from "src/app/@core/mock/vendor-data.service";
import { FormConfig } from "src/app/@shared/components/admin-form";
import { PurchaseOrderLineFormComponent } from "../purchase-order-line-form/purchase-order-line-form.component";
import { ShipmentDetailFormComponent } from "../shipment-detail-form/shipment-detail-form.component";

const poStatus = {
  sampleStatus: {
    Draft: "Draft",
    Open: "Open",
    Released: "Released",
    Closed: "Closed",
  },
  orderStatus: {
    Open: "Open",
    Ready: "Ready",
    Confirmed: "Confirend",
    Rejected: "Rejected",
  },
};

@Component({
  selector: "app-purchase-order-form",
  templateUrl: "./purchase-order-form.component.html",
  styleUrls: ["./purchase-order-form.component.scss"],
})
export class PurchaseOrderFormComponent implements OnInit {
  @ViewChild("EditorTemplate", { static: true })
  EditorTemplate: TemplateRef<any> | undefined;
  poHeaderFormData = {
    poReference: "",
    vendor: {
      vendorId: "",
      vendorContacts: [],
    },
    vendorContact: {
      vendorContactId: "",
    },
    shipToDepartment: {
      departmentId: "",
      address: "",
    },
    billToAddress: "",
    shipToAddress: "",
    tradeTerm: {
      tradeTermId: "",
    },
    remarks: "",
    poDetail: [],
    status: "",
    sampleStatus: "",
    issueDate: "",
    dueDate: "",
    createdAt: "",
    updatedAt:""
  };

  mode: string = "Add";
  paramId: string = "";
  selectedBrand: any = {};

  vendorList: Vendor[] = [];
  departmentList: Department[] = [];
  tradeTermList: TradeTerm[] = [];
  poLineItemList: poLineItem[] = [];
  company!: any;

  formData = {};
  editForm: any = null;
  formEditFlag: boolean = false;

  busy: Subscription | undefined;

  status: any = "";
  sampleStatus: any = "";
  issueDate!: string;
  dueDate!: string;

  constructor(
    private companyDataService: CompanyDataService,
    private vendorListServices: VendorListDataService,
    private tradeTermServices: TradeListDataService,
    private departmentListServices: DepartmentDataService,
    private poDataService: PoDataService,
    private dialogService: DialogService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.paramId = this.route.snapshot.params["id"];
    this.mode = this.route.snapshot.params["id"] ? "Edit" : "Add";
    this.getVendorList();
    this.getCompanyList();
    this.getDepartmentList();
    this.getTradeTermList();
    this.getVendorContactList();
    if (this.mode === "Edit") {
      this.getPOHeaderById(this.paramId);
    }
  }

  getPOHeaderById(paramId: string) {
    this.poDataService.getPOById(paramId).subscribe((res) => {
      this.poHeaderFormData = res;
      this.poLineItemList = this.poHeaderFormData.poDetail;
      this.status = this.poHeaderFormData.status;
      this.sampleStatus = this.poHeaderFormData.sampleStatus;
      this.issueDate = this.poHeaderFormData.issueDate
        ? this.poHeaderFormData.issueDate
        : "";
      this.dueDate = this.poHeaderFormData.dueDate
        ? this.poHeaderFormData.dueDate
        : "";
      if (this.poHeaderFormData.status !== poStatus.sampleStatus.Draft) {
        this.formEditFlag = true;
      } else {
        this.formEditFlag = false;
      }
    });
  }

  verticalLayout: FormLayout = FormLayout.Vertical;

  getValue(value: object) {
    console.log(value);
  }

  getVendorList() {
    this.vendorListServices.getVendorList().subscribe((res: any) => {
      this.vendorList = res.content;
    });
  }

  getCompanyList() {
    this.companyDataService.getCompanyList({}, "").subscribe((res: any) => {
      this.company = res;
    });
  }

  getDepartmentList() {
    this.departmentListServices.getDepartmentList().subscribe((res: any) => {
      this.departmentList = res.content;
    });
  }

  getTradeTermList() {
    this.tradeTermServices.getTradeList().subscribe((res: any) => {
      this.tradeTermList = res.content;
    });
  }

  getVendorContactList() {
    return this.poHeaderFormData.vendor.vendorContacts;
  }

  changePoToSubmit() {
    const poDetail = this.poLineItemList.map((poDetail: any, index: number) => {
      return {
        lineNo: index + 1,
        ...poDetail,
      };
    });

    const data = {
      poReference: this.poHeaderFormData.poReference,
      vendorId: this.poHeaderFormData.vendor.vendorId,
      vendorContactId: this.poHeaderFormData.vendorContact.vendorContactId,
      companyId: this.company.companyId,
      shipToDepartmentId: this.poHeaderFormData.shipToDepartment.departmentId,
      billToAddress: this.poHeaderFormData.billToAddress,
      shipToAddress: this.poHeaderFormData.shipToAddress,
      tradeTermId: this.poHeaderFormData.tradeTerm.tradeTermId,
      remarks: this.poHeaderFormData.remarks,
      poDetails: poDetail,
    };

    this.poDataService
      .changePOToSubmit(this.paramId, data)
      .subscribe((data) => {
        this.getPOHeaderById(this.paramId);
      });
  }

  changePoToReady() {
    this.poDataService.changePOToReady(this.paramId).subscribe((data) => {
      this.getPOHeaderById(this.paramId);
    });
  }

  changePoToConfirm() {
    this.poDataService.changePOToConfirm(this.paramId).subscribe((data) => {
      this.getPOHeaderById(this.paramId);
    });
  }

  changePoToReject() {
    this.poDataService.changePOToReject(this.paramId).subscribe((data) => {
      this.getPOHeaderById(this.paramId);
    });
  }

  releasePo() {
    this.poDataService.releasePO(this.paramId).subscribe((data) => {
      this.getPOHeaderById(this.paramId);
    });
  }

  closePo() {
    this.poDataService.closePO(this.paramId).subscribe((data) => {
      // this.getPOHeaderById(this.paramId);
      this.router.navigate(["/operation/purchase-order"]);
    });
  }

  cancelPo() {
    this.poDataService.cancelPO(this.paramId).subscribe((data) => {
      this.getPOHeaderById(this.paramId);
    });
  }

  submitPoHeaderForm({ valid, directive, data, errors }: any) {
    console.log(this.poLineItemList);
    const poDetail: any[] = this.poLineItemList.map(
      (poDetail: any, index: number) => {
        return {
          lineNo: index + 1,
          ...poDetail,
        };
      }
    );

    if (valid) {
      const data = {
        poReference: this.poHeaderFormData.poReference,
        vendorId: this.poHeaderFormData.vendor.vendorId,
        vendorContactId: this.poHeaderFormData.vendorContact.vendorContactId,
        companyId: this.company.companyId,
        shipToDepartmentId: this.poHeaderFormData.shipToDepartment.departmentId,
        billToAddress: this.poHeaderFormData.billToAddress,
        shipToAddress: this.poHeaderFormData.shipToAddress,
        tradeTermId: this.poHeaderFormData.tradeTerm.tradeTermId,
        remarks: this.poHeaderFormData.remarks,
        poDetails: poDetail,
      };

      console.log(data);

      if (this.mode === "Add") {
        this.poDataService.addPO(data).subscribe((data) => {
          console.log("data", data);
          this.router.navigate(["/operation/purchase-order"]);
        });
      } else {
        this.poDataService.updatePO(this.paramId, data).subscribe((data) => {
          this.getPOHeaderById(this.paramId);
        });
      }
    } else {
      // error tip
      console.log("errors", errors);
    }
  }

  addPOLineItem() {
    this.editForm = this.dialogService.open({
      id: "add-dialog",
      width: "1200px",
      maxHeight: "600px",
      title: "Add Purchase Order Line",
      showAnimate: false,
      content: PurchaseOrderLineFormComponent,
      buttons: [],
      backdropCloseable: true,
      onClose: () => {},
      data: {
        close: () => {
          this.editForm!.modalInstance.hide();
        },
        returnData: (values: any) => {
          const poDetails = values.poDetails;
          this.editForm!.modalInstance.hide();
          if (poDetails !== undefined) {
            poDetails.map((value: any) => {
              this.poLineItemList.push(value);
            });
          }
        },
      },
    });
  }

  editPOLineItem(rowId: any, seasonId: any) {
    this.formData = this.poLineItemList.find((s: any) => s.id === rowId) ?? {};
    this.editForm = this.dialogService.open({
      id: "edit-dialog",
      width: "600px",
      maxHeight: "600px",
      title: "Edit PO Line item",
      showAnimate: false,
      contentTemplate: this.EditorTemplate,
      backdropCloseable: true,
      onClose: () => {},
      buttons: [],
    });
  }

  onCanceled() {
    this.editForm!.modalInstance.hide();
  }

  onSubmitted(e: any) {
    this.editForm!.modalInstance.hide();
    const data = {
      poReference: this.poHeaderFormData.poReference,
      vendorId: this.poHeaderFormData.vendor.vendorId,
      vendorContactId: this.poHeaderFormData.vendorContact.vendorContactId,
      // companyId: this.poHeaderFormData.company.companyId,
      shipToDepartmentId: this.poHeaderFormData.shipToDepartment.departmentId,
      billToAddress: this.poHeaderFormData.billToAddress,
      shipToAddress: this.poHeaderFormData.shipToAddress,
      tradeTermId: this.poHeaderFormData.tradeTerm.tradeTermId,
      remarks: this.poHeaderFormData.remarks,
      poDetails: [
        ...this.poLineItemList,
        {
          lineNo: this.poLineItemList.length + 1,
          ...e,
        },
      ],
    };

    this.poDataService.updatePO(this.paramId, data).subscribe(() => {
      this.getPOHeaderById(this.paramId);
    });
  }

  addShipmentDetail() {
    this.editForm = this.dialogService.open({
      id: "add-dialog",
      width: "1100px",
      maxHeight: "800px",
      title: "Add Shipment Detail Line",
      showAnimate: false,
      content: ShipmentDetailFormComponent,
      buttons: [],
      backdropCloseable: true,
      onClose: () => {},
      data: {
        close: () => {
          this.editForm!.modalInstance.hide();
        },
        detail: {
          poId: this.paramId,
        },
      },
    });
  }

  deletePOLine(index: number) {
    this.poHeaderFormData.poDetail.splice(index, 1);
    this.poLineItemList = this.poHeaderFormData.poDetail;
  }
}
