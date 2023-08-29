import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from "@angular/router";
import { UserManagementService } from 'src/app/@core/mock/user-management.service';
import {
  SortEventArg,
  ToastService
} from "ng-devui";
import { PageParam, SearchParam } from "src/app/@core/data/searchFormData";
import { MSG } from 'src/config/global-var';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  pageParam: any = {
    pageNo: "",
    pageSize: "",
    sortBy: "",
    sortDir: "",
  };
  busy: Subscription | undefined;
  basicDataSource: any[] = [];
  pager = {
    total: 0,
    pageIndex: 1,
    pageSize: 10,
  };

  columnSize: any = {
    termsName: "",
    updatedAt: "",
    action: "",
    active: "",
  };

  constructor(
    private userManagementService: UserManagementService,
    private router: Router,
    private toastService: ToastService,
  ) { }

  ngOnInit(): void {
    this.getCreditTermsList();
  }

  getCreditTermsList() {
    this.busy = this.userManagementService
      .getList()
      .subscribe((res) => {
        this.basicDataSource = res.content;
        this.pager.total = res.totalItems;
        // Object.keys(res.listSize).map((key) => {
        //   let widthValue = res.listSize[key] + "%";
        //   this.columnSize[key] = widthValue;
        // });
      });
  }

  multiSortChange(e: SortEventArg[]) {
    if (e.length === 1) {
      this.pageParam.sortBy = e[0].field;
      this.pageParam.sortDir = e[0].direction.toLowerCase();
      this.userManagementService.setPageParams(this.pageParam);
      this.getCreditTermsList();
    }
  }

  setPageParams(pageParam: PageParam) {
    this.userManagementService.setPageParams(pageParam);
    this.getCreditTermsList();
  }

  onPageChange(e: number) {
    this.pager.pageIndex = e;
    this.pageParam.pageNo = this.pager.pageIndex - 1;
    this.setPageParams(this.pageParam);
    this.getCreditTermsList();
  }

  onSizeChange(e: number) {
    this.pager.pageSize = e;
    this.pageParam.pageSize = e;
    this.setPageParams(this.pageParam);
    this.getCreditTermsList();
  }

  editRow(rowId: any, index: number) {
    this.router.navigate([`/user-management/user/edit/${rowId}`]);
  }

  _showRoles(roles: any) {
    let rNames = roles?.map((role: any) => role?.name);
    return rNames?.join(",");
  }

}
