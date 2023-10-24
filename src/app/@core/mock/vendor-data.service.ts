import { Injectable } from "@angular/core";
import { Observable, of as observableOf } from "rxjs";
import { delay } from "rxjs/operators";
import { Brand, BrandListData, Card, ListPager } from "../data/brandList";
import { Season } from "../data/season";
// import { ListDataService } from './brand-data.service';
import { environment } from "src/environments/environment";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { VendorListData } from "../data/vendorList";
import { PageParam, SearchParam } from "../data/searchFormData";

const baseUrl = environment.baseUrl;

@Injectable()
export class VendorListDataService extends VendorListData {
  baseApiUrl: string = environment.baseUrl;
  constructor(private http: HttpClient) {
    super();
  }

  private searchParams = {
    filters: [
      {
        field: "",
        operator: "",
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
    this.searchParams = {
      filters: [
        {
          field: searchParams.columnName,
          operator: searchParams.searchType,
          value: searchParams.keyword,
        },
      ],
    };
  }

  setPageParams(pageParams: PageParam) {
    this.pageParams = pageParams;
    console.log(this.pageParams);
  }

  private seasonList: Season[] = [];

  getVendorList(pageParams?: any) {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        // "Content-Type": "application/json",
      }),
      params: new HttpParams({
        fromObject: pageParams ? pageParams:this.pageParams,
      }),
    };

    return this.http.post(`${this.baseApiUrl}/vendors/list`, this.searchParams, httpOptionsToken);
  }

  addVendor(data: any) {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        // "Content-Type": "application/json",
      }),
    };
    console.log("data=============", data);
    return this.http.post(`${this.baseApiUrl}/vendors`, data);
  }
  updateVendor(id: string, data: any): Observable<any> {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        // "Content-Type": "application/json",
      }),
    };

    console.log("data in brand");

    return this.http.put(`${this.baseApiUrl}/vendors/${id}`, data, httpOptionsToken);
  }
  getVendorById(id: string): Observable<any> {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        // "Content-Type": "application/json",
      }),
    };

    return this.http.get(`${this.baseApiUrl}/vendors/${id}`, httpOptionsToken);
  }
  addSeason(data: Season) {
    this.seasonList.unshift(data);
    console.log({ data });
  }

  addSeasonListData(e: any) {}

  addContactInVendor(id: string, data: any): Observable<any> {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        // "Content-Type": "application/json",
      }),
    };

    return this.http.post(`${this.baseApiUrl}/vendors/${id}/contact`, data, httpOptionsToken);
  }
}
