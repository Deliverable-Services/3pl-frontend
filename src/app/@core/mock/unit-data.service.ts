import { Injectable } from "@angular/core";
import { Observable, of as observableOf } from "rxjs";
import { delay } from "rxjs/operators";
import { Brand, Card, ListPager } from "../data/brandList";
import { Season } from "../data/season";
// import { ListDataService } from './brand-data.service';
import { environment } from "src/environments/environment";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Unit, UnitListData } from "../data/unitList";
import { PageParam, SearchParam } from "../data/searchFormData";

const baseUrl = environment.baseUrl;

@Injectable()
export class UnitListDataService extends UnitListData {
  baseApiUrl: string = environment.baseUrl;
  constructor(private http: HttpClient) {
    super();
  }

  private searchParams = {
    filters: [
      {
        field: "unitName",
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

  getUnitList() {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
      params: new HttpParams({
        fromObject: this.pageParams,
      }),
    };

    return this.http.post(
      `${this.baseApiUrl}/units`,
      this.searchParams,
      httpOptionsToken
    );
  }

  getUnitListActive() {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
      params: new HttpParams({
        fromObject: this.pageParams,
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
      `${this.baseApiUrl}/units`,
      searchParams,
      httpOptionsToken
    );
  }

  getUnitById(id: string): Observable<any> {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.http.get(`${this.baseApiUrl}/unit/${id}`, httpOptionsToken);
  }

  addUnit(data: any): Observable<any> {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.http.post(`${this.baseApiUrl}/unit`, data, httpOptionsToken);
  }

  updateUnit(id: string, data: any): Observable<any> {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.http.put(
      `${this.baseApiUrl}/unit/${id}`,
      data,
      httpOptionsToken
    );
  }
  statusToggle(data: any) {
    return this.http.put(
      `${this.baseApiUrl}/unit/${data.unitId}/${data.active}`,
      ""
    );
  }
}
