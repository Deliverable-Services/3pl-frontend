import { Component, OnInit } from "@angular/core";
import { FormLayout, ToastService } from "ng-devui";
import { ActivatedRoute, Router } from "@angular/router";
import { UserManagementService } from "src/app/@core/mock/user-management.service";
import { MSG } from "src/config/global-var";
import { ConnectionLocationService } from "src/app/@core/mock/connection-location.service";
import { VendorListDataService } from "src/app/@core/mock/vendor-data.service";

@Component({
  selector: "app-user-form",
  templateUrl: "./user-form.component.html",
  styleUrls: ["./user-form.component.scss"],
})
export class UserFormComponent implements OnInit {
  mode: string = "Add";
  verticalLayout: FormLayout = FormLayout.Vertical;
  connectionLocationListDC: any[] = [];
  connectionLocationListStore: any[] = [];
  vendorList: any[] = [];
  projectFormData: any = {
    userId: "",
    username: "",
    email: "",
    description: "",
    title: "",
    department: "",
    rfidManager: false,
    group: "",
    roles: [],
    selectedRoles: [],
    store: {
      connectionLocationId: "",
    },
    vendor: {
      id: "",
    },
    warehouse: {
      connectionLocationId: "",
    },
    storeInfo: {},
    vendorInfo: {},
    warehouseInfo: {},
  };
  customStylesDC = {
    position: 'absolute',
    marginTop: '-222px',
    marginLeft: '150px',
    width: '20%',
  };
  customStylesStore= {
    position: 'absolute',
    width: '20%',
    marginTop: '-157px',
    marginLeft: '150px',
  };
  customStyleVendor = {
    position: "absolute",
    marginTop: "32px",
    width: "20%",
    marginLeft: "87px"
  }
  groups: any[] = ["SELECT", "INTERNAL", "EXTERNAL"];
  rolesName: any[] = [];
  paramId: string = "";
  // selectedCreditTerms: any = {};
  constructor(
    private userManagementService: UserManagementService,
    private connectionLocationService: ConnectionLocationService,
    private vendorListDataService: VendorListDataService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.paramId = this.route.snapshot.params["id"];
    this.mode = this.route.snapshot.params["id"] ? "Edit" : "Add";

    // this.getRoles();
    this.getConnectionLocationList();
    this.getCreditTermsById(this.paramId);
    this.getVendorList();
  }

  showRole(event: any) {
    this.userManagementService.getRoles().subscribe((res) => {
      // Filter roles based on the event condition
      this.rolesName = res
        ?.filter((role: any) => role.group === event)
        .map((filteredRole: any) => filteredRole.name);
    });
  }

  getCreditTermsById(id: string) {
    this.userManagementService.getById(id).subscribe((res) => {
      this.projectFormData = res;
      this.projectFormData.selectedRoles = res?.roles?.map(
        (role: any) => role?.name
      );

      this.projectFormData.store = res?.store || { connectionLocationId: "" };
      this.projectFormData.warehouse = res?.warehouse || {
        connectionLocationId: "",
      };
      this.projectFormData.vendor = res?.vendor || { id: "" }; 

      this.projectFormData.storeInfo = res?.store || {};
      this.projectFormData.warehouseInfo = res?.warehouse || {};
      this.projectFormData.vendorInfo = res?.vendor || {};
      this.showRole(res.group);
    });
  }

  getConnectionLocationList() {
    this.connectionLocationService.getList().subscribe((res) => {
      this.connectionLocationListDC = res?.filter(
        (c: any) => c?.nodeType?.toLowerCase() === "dc"
      );
      this.connectionLocationListStore = res?.filter(
        (c: any) => c?.nodeType?.toLowerCase() === "store"
      );
      this.connectionLocationListStore = this.connectionLocationListStore?.map(
        (c: any) => {
          return {
            connectionLocationId: c?.connectionLocationId || "",
            nodeName: c?.nodeName || "",
            nodeType: c?.nodeType,
          };
        }
      );
      this.connectionLocationListDC = this.connectionLocationListDC?.map(
        (c: any) => {
          return {
            connectionLocationId: c?.connectionLocationId || "",
            nodeName: c?.nodeName || "",
            nodeType: c?.nodeType,
          };
        }
      );
    });
  }

  getVendorList() {
    this.vendorListDataService.getVendorList().subscribe((res: any) => {
      this.vendorList = res?.content?.map((c: any) => {
        return {
          id: c?.id || "",
          name: c?.primaryContactName || "",
        };
      });
    });
  }

  selected(event: any) {
    this.projectFormData.roles = this.projectFormData.selectedRoles?.map(
      (role: any) => {
        return { name: role };
      }
    );
  }

  submitProjectForm(event: any) {
    let formData = this.projectFormData;

    formData["rfidManager"] = formData.selectedRoles.includes("RFID Manager");

    if (event?.valid) {
      // Create an object to hold the request data with only the desired keys and values
      const requestData: any = {
        userId: formData.userId,
        username: formData.username,
        email: formData.email,
        description: formData.description,
        title: formData.title,
        department: formData.department,
        rfidManager: formData.rfidManager,
        group: formData.group,
        roles: formData.roles,
      };

      // Only include "store," "vendor," and "warehouse" keys if the "group" conditions are met
      if (formData.group === "EXTERNAL" && formData.selectedRoles.includes("Factories")) {
        requestData.vendor = formData.vendor;
      }

      if (formData.group === "INTERNAL") {
        if (formData.selectedRoles.includes("Store Manager")) {
          requestData.store = formData.store;
        }
        if (formData.selectedRoles.includes("DC Manager")) {
          requestData.warehouse = formData.warehouse;
        }
      }

      this.userManagementService
        .updateUser(this.paramId, requestData)
        .subscribe((res) => {
          this._showToast(res);
        });
    }
  }

  _showToast(resp: any) {
    let type, msg;
    if (resp) {
      type = "success";
      msg = this.mode === "Add" ? MSG.create : MSG.update;
      this.router.navigate(["/user-management/user"]);
    } else {
      type = "error";
      msg = MSG.error;
    }
    this.toastService.open({
      value: [{ severity: type, content: msg }],
      life: 2000,
    });
  }

  checkRole(event: any) {
    let stEv: any = event;
    let checkIndex = this.projectFormData.roles?.findIndex(
      (e: any) => e.name === stEv.value
    );

    if (checkIndex > -1) {
      this.projectFormData.roles?.splice(checkIndex, 1);
    } else {
      this.projectFormData.roles?.push({
        name: stEv.value,
      });
    }
  }

  manageVal(event: any, type: string) {
    console.log("type--------------------------------------->", type);
    console.log(this.projectFormData, event, type);
    if (type === "store") {
      this.projectFormData.store["connectionLocationId"] =
        event?.connectionLocationId;
    } else if (type === "warehouse") {
      this.projectFormData.warehouse["connectionLocationId"] =
        event?.connectionLocationId;
    } else if (type === "vendor") {
      this.projectFormData.vendor["id"] = event?.id;
    }
  }
}
