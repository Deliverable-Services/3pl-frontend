import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";
import { DialogService, FormLayout, SortEventArg, TableWidthConfig } from "ng-devui";
import { Subscription } from "rxjs";
import { Brand } from "src/app/@core/data/brandList";
import { Category } from "src/app/@core/data/categoryList";
import { PageParam, SearchParam } from "src/app/@core/data/searchFormData";
import { Unit } from "src/app/@core/data/unitList";

import { CategoryListDataService } from "src/app/@core/mock/category-data.service";
import { UnitListDataService } from "src/app/@core/mock/unit-data.service";
import { FormConfig } from "src/app/@shared/components/admin-form";

@Component({
  selector: "da-unit-list",
  templateUrl: "./unit-list.component.html",
  styleUrls: ["./unit-list.component.scss"],
})
export class UnitListComponent implements OnInit {
  filterAreaShow = false;
  isAdd: string = "ADD";
  isAddSession: boolean = true;
  @Output() checked = new EventEmitter();

  pageParam: any = {
    pageNo: "",
    pageSize: "",
    sortBy: "",
    sortDir: "",
  };

  searchWithUnitName: SearchParam = {
    keyword: "",
    sort: "asc",
    columnName: "unitName",
    searchType: "match",
  };

  basicDataSource: Unit[] = [];

  formData = {};

  editForm: any = null;

  editRowIndex = -1;

  pager = {
    total: 0,
    pageIndex: 1,
    pageSize: 10,
  };

  columnSize: any = {
    unitName: "",
    updatedAt: "",
    action: "",
    active: "",
  };

  busy: Subscription | undefined;

  constructor(
    private unitListDataService: UnitListDataService,
    private dialogService: DialogService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.getUnitList();
  }

  getUnitList() {
    this.busy = this.unitListDataService
      .getUnitList()
      .subscribe((res: any) => {
        this.basicDataSource = res.content;
        this.pager.total = res.totalItems;
        Object.keys(res.listSize).map((key) => {
          let widthValue = res.listSize[key] + "%";
          return (this.columnSize[key] = widthValue);
        });
      });
  }

  setSearchParams(searchParam: SearchParam) {
    this.unitListDataService.setSearchParams(searchParam);
    this.getUnitList();
  }

  setPageParams(pageParam: PageParam) {
    this.unitListDataService.setPageParams(pageParam);
    this.getUnitList();
  }

  editUnit(rowId: any, index: number) {
    this.router.navigate([`/product/unit/edit/${rowId}`]);
  }


  onPageChange(e: number) {
    this.pager.pageIndex = e;
    this.pageParam.pageNo = this.pager.pageIndex - 1;
    this.setPageParams(this.pageParam);
    this.getUnitList();
  }

  onSizeChange(e: number) {
    this.pager.pageSize = e;
    this.pageParam.pageSize = e;
    this.setPageParams(this.pageParam);
    this.getUnitList();
  }

  search(e: any, searchParam: SearchParam) {
    searchParam.keyword = e.target.value;
    this.setSearchParams(searchParam);
    this.getUnitList();
  }

  multiSortChange(e: SortEventArg[]) {
    if (e.length === 1) {
      this.pageParam.sortBy = e[0].field;
      this.pageParam.sortDir = e[0].direction.toLowerCase();
      this.unitListDataService.setPageParams(this.pageParam);
      this.getUnitList();
    }
  }

  toggleCheck(activeCheck: any, rowId: any) {
    let data = {
      active: activeCheck == false ? "inactive" : "active",
      unitId: rowId.unitId,
    };
    this.unitListDataService.statusToggle(data).subscribe((res: any) => {});
  }
}
