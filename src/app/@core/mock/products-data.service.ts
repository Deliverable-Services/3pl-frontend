import { Injectable } from "@angular/core";
import { Observable, of as observableOf } from "rxjs";

import { environment } from "src/environments/environment";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { ProductsListData } from "../data/styleList";
import { Products } from "../data/productList";
import { PageParam, SearchParam } from "../data/searchFormData";

@Injectable()
export class ProductsListDataService extends ProductsListData {
  baseApiUrl: string = environment.baseUrl;
  constructor(private http: HttpClient) {
    super();
  }

  private searchParams = {
    filters: [
      {
        field: "styleName",
        operator: "match",
        value: "",
      },
      {
        field: "status",
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
  }

  getList(): Observable<any> {
    const httpOptionsToken = {
      params: new HttpParams({
        fromObject: this.pageParams,
      }),
    };

    return this.http.post(
      `${this.baseApiUrl}/product/list`,
      this.searchParams,
      httpOptionsToken
    );
  }

  getListActive(): Observable<any> {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
      params: new HttpParams({
        // fromObject: this.pageParams,
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
      `${this.baseApiUrl}/styles`,
      searchParams,
      httpOptionsToken
    );
  }

  add(data: Products) {
    return this.http.post(`${this.baseApiUrl}/product`, data);
  }

  update(id: string, data: Products): Observable<any> {
    return this.http.put(
      `${this.baseApiUrl}/product/${id}`,
      data
    );
  }

  setPublish(id: string, data: Products): Observable<any> {
    const token = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJPd25lclByaW5jaXBhbHtlbnRlcnByaXNlSUQ9J0JUVicsIGNvbXBhbnlJRD0nbnVsbCcsIG93bmVySUQ9J251bGwnLCB3bXNDb21wYW55SUQ9J251bGwnLCB1c2VySUQ9J2FwcHN1cHBvcnQnfSIsImF1dGgiOiJST0xFX1VTRVIiLCJvd25lciI6IntcImVudGVycHJpc2VJRFwiOlwiQlRWXCIsXCJjb21wYW55SURcIjpudWxsLFwib3duZXJJRFwiOm51bGwsXCJ3bXNDb21wYW55SURcIjpudWxsLFwidXNlcklEXCI6XCJhcHBzdXBwb3J0XCJ9IiwiZXhwIjoxNjg4MDI5MzA0fQ.TFu6cQ5yUwr2bKuAV-IvFDtWoJECSDvd9_va3rPnBX7V2LNFnx8mjGwgOVRZvOvFMVRANMu5A8agOV6-QN1SRg'; // Replace with your actual bearer token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(
      `${this.baseApiUrl}/product/${id}/publish`,
      data,
      { headers }
    );
  }  

  setActive(id: string): Observable<any> {
    return this.http.put(
      `${this.baseApiUrl}/product/${id}/active`,
      []
    );
  }

  setInactive(id: string): Observable<any> {
    return this.http.put(
      `${this.baseApiUrl}/product/${id}/inactive`,
      []
    );
  }

  getById(id: string): Observable<any> {
    return this.http.get(`${this.baseApiUrl}/product/${id}`);
  }
  statusToggle(data: any) {
    return this.http.put(
      `${this.baseApiUrl}/style/${data.styleId}/${data.active}`,
      ""
    );
  }
}
