import { Component, OnInit } from '@angular/core';
import { FormLayout, ToastService } from "ng-devui";
import { ActivatedRoute, Router } from "@angular/router";
import { UserManagementService } from 'src/app/@core/mock/user-management.service';
import { MSG } from 'src/config/global-var';
import { ConnectionLocationService } from 'src/app/@core/mock/connection-location.service';
import { VendorListDataService } from 'src/app/@core/mock/vendor-data.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {

  mode: string = "Add";
  verticalLayout: FormLayout = FormLayout.Vertical;
  connectionLocationListDC: any[] = [];
  connectionLocationListStore: any[] = [];
  vendorList: any[] = [];
  projectFormData:any = {
    userId: "",
    username: "",
    email: "",
    description: "",
    title: "",
    department: "",
    rfidManager: false,
    group: "",
    roles: [],
    selectedRoles: []
  };
  groups: any[] = ["SELECT","INTERNAL", "EXTERNAL"];
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
  ) { }

  ngOnInit(): void {
    this.paramId = this.route.snapshot.params["id"];
    this.mode = this.route.snapshot.params["id"] ? "Edit" : "Add";

    // this.getRoles();
    this.getConnectionLocationList();
    this.getCreditTermsById(this.paramId);
  }

  showRole(event: any) {
    console.log('showRole called with event:', event);
  
    this.userManagementService.getRoles().subscribe((res) => {
      // Filter roles based on the event condition
      this.rolesName = res?.filter((role: any) => role.group === event).map((filteredRole: any) => filteredRole.name);
      console.log(this.rolesName, 'filtered roles');
    });
  }

  
  getCreditTermsById(id: string) {
    this.userManagementService.getById(id).subscribe((res) => {
      this.projectFormData = res;
      this.projectFormData.selectedRoles = res?.roles?.map((role: any) => role?.name);
    });
  }

  getConnectionLocationList() {
    this.connectionLocationService
      .getList()
      .subscribe((res) => {
        this.connectionLocationListDC = res?.filter((c: any) => c?.nodeType?.toLowerCase() === 'dc');
        this.connectionLocationListStore = res?.filter((c: any) => c?.nodeType?.toLowerCase() === 'store');
        this.connectionLocationListStore = this.connectionLocationListStore?.map((c: any) => {
          return {
                connectionLocationId: c?.connectionLocationId || "",
                nodeName: c?.nodeName || "",
                nodeType: c?.nodeType,
          }
        })
        this.connectionLocationListDC = this.connectionLocationListDC?.map((c: any) => {
          return {
                connectionLocationId: c?.connectionLocationId || "",
                nodeName: c?.nodeName || "",
                nodeType: c?.nodeType,
          }
        })
      });
  }

  // getVendorList() {
  //   this.vendorListDataService
  //     .getVendorList()
  //     .subscribe((res) => {
  //       this.vendorList = res;
  //       this.vendorList = this.connectionLocationListStore?.map((c: any) => {
  //         return {
  //               id: c?.id || "",
  //               name: c?.primaryContactName || "",
  //         }
  //       })
        
  //     });
  // }

  selected(event: any) {
    console.log('event selected',this.projectFormData.selectedRoles);
    
  }

  submitProjectForm(event: any) {
    let formData = this.projectFormData;
    delete formData.selectedRoles;
    if (event?.valid) {
      this.userManagementService
          .updateUser(this.paramId, formData)
          .subscribe((res) => {
            this._showToast(res);
          });
    }
  }

  _showToast(resp: any) {
    let type, msg;
    if(resp) {
      type = 'success';
      msg = this.mode === 'Add' ? MSG.create:MSG.update;
      this.router.navigate(["/user-management/user"]);
    } else {
      type = 'error';
      msg = MSG.error;
    }
    this.toastService.open({
      value: [
        { severity: type, content: msg},
      ],
      life: 2000,
    });
  }

  checkRole(event: any) {
    let stEv:any = event;
    let checkIndex = this.projectFormData.roles?.findIndex(((e: any) => e.name === stEv.value));

    if(checkIndex > -1) {
      this.projectFormData.roles?.splice(checkIndex, 1);
    } else {
      this.projectFormData.roles?.push({
        name: stEv.value
      });
    }
  }

}
