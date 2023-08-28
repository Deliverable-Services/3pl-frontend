import { Component, OnInit } from '@angular/core';
import { FormLayout, ToastService } from "ng-devui";
import { ActivatedRoute, Router } from "@angular/router";
import { UserManagementService } from 'src/app/@core/mock/user-management.service';
import { MSG } from 'src/config/global-var';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {

  mode: string = "Add";
  verticalLayout: FormLayout = FormLayout.Vertical;
  projectFormData:any = {
    userId: "",
    username: "",
    email: "",
    description: "",
    title: "",
    department: "",
    group: "",
    roles: [],
    selectedRoles: []
  };
  groups: any[] = ["INTERNAL", "EXTERNAL"];
  rolesName: any[] = ["A", "B"];
  paramId: string = "";
  selectedCreditTerms: any = {};
  constructor(
    private userManagementService: UserManagementService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.paramId = this.route.snapshot.params["id"];
    this.mode = this.route.snapshot.params["id"] ? "Edit" : "Add";

    this.getCreditTermsById(this.paramId);
  }

  getCreditTermsById(id: string) {
    this.userManagementService.getById(id).subscribe((res) => {
      this.selectedCreditTerms = res;
      this.projectFormData = res;
    });
  }

  submitProjectForm(event: any) {
    let formData = this.projectFormData;
    delete formData.selectedRoles;
    if (event?.valid) {
      this.userManagementService
          .updateCreditTerms(this.paramId, formData)
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
