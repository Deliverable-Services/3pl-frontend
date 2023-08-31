import { Component, TemplateRef, ViewChild, OnInit } from "@angular/core";
import { AbstractControlDirective } from "@angular/forms";
import { ActivatedRoute, Params, Route, Router } from "@angular/router";
import { DFormGroupRuleDirective, DialogService, FormLayout } from "ng-devui";
import { Observable, Subscription, of } from "rxjs";
import { delay } from "rxjs/operators";
import { Brand } from "src/app/@core/data/brandList";
import { Season } from "src/app/@core/data/season";
import { BrandListDataService } from "src/app/@core/mock/brand-data.service";
import { VendorListDataService } from "src/app/@core/mock/vendor-data.service";
import { FormConfig } from "src/app/@shared/components/admin-form";

@Component({
  selector: "app-vendor-form",
  templateUrl: "./vendor-form.component.html",
  styleUrls: ["./vendor-form.component.scss"],
})
export class VendorFormComponent implements OnInit {
  @ViewChild("EditorTemplate", { static: true })
  EditorTemplate!: TemplateRef<any>;
  todayDate: any = new Date();
  
  projectFormData = {
    id: "",
    address: "",
    businessRegNo: "",
    companyName: "",
    generalEmail: "",
    generalPhone: "",
    paymentCurrency: "",
    primaryContactEmail: "",
    primaryContactName: "",
    primaryContactPhone1: "",
    primaryContactPhone2: "",
    status: "ACTIVE",
    website: "",
    creditTermsDto: {
      createdBy: "",
      createdDate: "",
      creditDay: 0,
      creditTermsDetails: "",
      creditTermsId: "",
      creditTermsSubject: "",
      lastModifiedBy: "",
      lastModifiedDate: "",
      status: "Active"
    },
    bankInfo: {
      accName: "",
      accNo: "",
      bankName: "",
      swiftCode: ""
    },
  };
  mode: string = "Add";
  paramId: string = "";
  selectedVendor: any = {};

  contactList: Season[] = [];
  brandList: Brand[] = [];
  formData = {};
  editForm: any = null;
  
  formConfig: FormConfig = {
    layout: FormLayout.Horizontal,
    items: [
      {
        label: "Contact Name",
        prop: "contactName",
        type: "input",

        required: true,
        rule: {
          validators: [{ required: true }],
        },
      },
      {
        label: "Department",
        prop: "department",
        type: "input",
      },
      {
        label: "Contact No.",
        prop: "contactNo",
        type: "input",

        required: true,
        rule: {
          validators: [{ required: true }],
        },
      },
      {
        label: "Email",
        prop: "contactEmail",
        type: "input",

        required: true,
        rule: {
          validators: [{ required: true }],
        },
      },
    ],

    labelSize: "",
  };
  busy!: Subscription;
  constructor(
    private vendorListDataService: VendorListDataService,
    private dialogService: DialogService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.paramId = this.route.snapshot.params["id"];
    this.mode = this.route.snapshot.params["id"] ? "Edit" : "Add";

    if (this.mode === "Edit") {
      this.getVendorById(this.paramId);
    }
  }

  verticalLayout: FormLayout = FormLayout.Vertical;

  getVendorById(id: string) {
    this.vendorListDataService.getVendorById(id).subscribe((res) => {
      console.log({ res });
      this.selectedVendor = res;
      this.contactList = res.vendorContacts;
      this.projectFormData = res;
    });
  }

  getValue(value: object) {
    console.log(value);
  }

  onCanceled() {
    this.editForm!.modalInstance.hide();
    // this.editRowIndex = -1;
  }

  everyRange(range: any) {
    return range.every((_: any) => !!_);
  }

  submitProjectForm({ valid, directive, data, errors }: any) {
    console.log("projectFormData", this.projectFormData);
    if (valid) {
      if (this.mode === "Add") {
        this.vendorListDataService
          .addVendor(this.projectFormData)
          .subscribe((data) => {
            console.log("data", data);
            this.router.navigate(["/business/vendor"]);
          });
      } else {
        console.log("in edit case", this.projectFormData);
        this.vendorListDataService
          .updateVendor(this.paramId, this.projectFormData)
          .subscribe((data) => {
            console.log({ data });
            this.router.navigate(["/business/vendor"]);
          });
      }
    } else {
      // error tip
      console.log("errors", errors);
    }
  }

  addSession() {
    console.log("click add session");
    this.editForm = this.dialogService.open({
      id: "add-dialog",
      width: "600px",
      maxHeight: "600px",
      title: "Add Contact",
      showAnimate: false,
      contentTemplate: this.EditorTemplate,
      backdropCloseable: true,
      onClose: () => {},
      buttons: [],
    });
  }

  editSeason(rowId: any, seasonId: any) {
    // console.log("click add session");
    // this.formData = this.seasonList.find((s: any) => s.id === rowId) ?? {};
    // this.editForm = this.dialogService.open({
    //   id: "add-dialog",
    //   width: "600px",
    //   maxHeight: "600px",
    //   title: "edit Contact",
    //   showAnimate: false,
    //   contentTemplate: this.EditorTemplate,
    //   backdropCloseable: true,
    //   onClose: () => {},
    //   buttons: [],
    // });
  }

  onSubmitted(e: any) {
    console.log("Submitted", e);
    this.editForm!.modalInstance.hide();

    if (this.mode === "ADD") {
      this.vendorListDataService
        .addContactInVendor(this.paramId, e)
        .subscribe(() => {
          console.log("add Season");
        });
    } else {
      this.vendorListDataService
        .addContactInVendor(this.paramId, e)
        .subscribe(() => {
          console.log("add Season");

          this.getVendorById(this.paramId);
        });
    }
  }

  editBrand(rowId: any, index: number) {
    this.mode = "EDIT";
    // this.editRowIndex = index;
    // this.formData = row;
    console.log({ rowId });
    this.router.navigate([`/pages/product/brand/edit/${rowId}`]);
  }
}
