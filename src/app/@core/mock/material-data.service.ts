import { Injectable } from "@angular/core";

import { ListPager, Material, MaterialListData } from "../data/material";
import { Observable, of as observableOf } from "rxjs";
import { delay } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { PageParam, SearchParam } from "../data/searchFormData";

const baseUrl = environment.baseUrl;

@Injectable()
export class MaterialListDataService extends MaterialListData {
  baseApiUrl = environment.baseUrl;

  constructor(private http: HttpClient) {
    super();
  }

  private searchParams = {
    filters: [
      {
        field: "materialName",
        operator: "match",
        value: "",
      },
      {
        field: "origin",
        operator: "match",
        value: "",
      },
    ],
  };

  private pageParams = {
    pageNo: "",
    pageSize: "",
    sortBy: "",
    sortDir: "",
  };

  setSearchParams(searchParams: SearchParam) {
    this.searchParams.filters = this.searchParams.filters.map((param: any) => {
      if (param.field === searchParams.columnName) {
        return {
          field: searchParams.columnName,
          operator: searchParams.searchType,
          value: searchParams.keyword,
        };
      } else {
        return param;
      }
    });
  }

  setPageParams(pageParams: PageParam) {
    this.pageParams = pageParams;
    console.log(this.pageParams);
  }

  private materialList: Material[] = [];

  addMaterial(data: Material) {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        // "Content-Type": "application/json",
      }),
    };

    return this.http.post(
      `${this.baseApiUrl}/material`,
      data,
      httpOptionsToken
    );
  }
  updateMaterial(id: string, data: Material): Observable<any> {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        // "Content-Type": "application/json",
      }),
    };

    return this.http.put(
      `${this.baseApiUrl}/material/${id}`,
      data,
      httpOptionsToken
    );
  }

  getMaterialList() {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
      params: new HttpParams({
        fromObject: this.pageParams,
      }),
    };

    return this.http.post(
      `${this.baseApiUrl}/materials`,
      this.searchParams,
      httpOptionsToken
    );
  }

  getMaterialListActive() {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    const searchParams = {
      filters: [
        {
          field: "isActive",
          operator: "equal",
          value: true,
        },
      ],
    };

    return this.http.post(
      `${this.baseApiUrl}/materials`,
      searchParams,
      httpOptionsToken
    );
  }

  getMaterialById(id: string): Observable<any> {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        // "Content-Type": "application/json",
      }),
    };

    return this.http.get(`${this.baseApiUrl}/material/${id}`, httpOptionsToken);
  }

  statusToggle(data: any) {
    return this.http.put(
      `${this.baseApiUrl}/material/${data.materialId}/${data.active}`,
      ""
    );
  }
}
