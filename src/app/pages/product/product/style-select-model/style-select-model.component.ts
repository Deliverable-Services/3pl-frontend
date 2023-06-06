import { Component, Input, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { StyleListDataService } from "src/app/@core/mock/style-data.service";

@Component({
  selector: "app-style-select-model",
  templateUrl: "./style-select-model.component.html",
  styleUrls: ["./style-select-model.component.scss"],
})
export class StyleSelectModelComponent implements OnInit {
  @Input() data: any;
  styleFormData = {
    style_type: "",
  };
  basicDataSource: any = [];

  formData = {};

  editForm: any = null;

  editRowIndex = -1;

  pager = {
    total: 0,
    pageIndex: 1,
    pageSize: 10,
  };

  busy: Subscription | undefined;

  ngOnInit(): void {
    this.getStyleList();
  }

  constructor(private styleListDataService: StyleListDataService) {}

  submitStyleForm(event: any) {
    this.data.getDataFromModel({
      style_type: this.styleFormData.style_type,
    });
  }

  getStyleList() {
    this.busy = this.styleListDataService.getStyleList().subscribe((res) => {
      this.pager.total = res.totalItems;

      this.basicDataSource = res.content.map((res1: any) => {
        return {
          ...res1,
          brandName: res1.brand.brandName,
          subCategory: res1.subCategory.subCategoryName,
          season: res1.season.seasonName,
        };
      });
    });
  }
}
