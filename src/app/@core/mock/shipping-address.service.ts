import { Injectable } from "@angular/core";
import { Observable, of as observableOf } from "rxjs";
import { environment } from "src/environments/environment";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { PageParam, SearchParam } from "../data/searchFormData";

const baseUrl = environment.baseUrl;

@Injectable()
export class ShippingAddressService {
  baseApiUrl: string = environment.baseUrl;
  constructor(private http: HttpClient) {
  }

  private searchParams = {
    filters: [
      {
        field: "market",
        operator: "match",
        value: "",
      },
      // {
      //   field: "styleCode",
      //   operator: "match",
      //   value: "",
      // },
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

  getList(params?:any): Observable<any> {
    const httpOptionsToken = {
      params: new HttpParams({
        fromObject: params? params:this.pageParams,
      }),
    };

    return this.http.post(
      `${this.baseApiUrl}/shipping-address/list`,
      this.searchParams,
      httpOptionsToken
    );
  }

  getStyleListActive(): Observable<any> {
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

  add(data: any) {
    console.log(':: data :: ', data)
    return this.http.post(`${this.baseApiUrl}/shipping-address`, data);
  }

  update(id: string, data: any): Observable<any> {
    return this.http.put(
      `${this.baseApiUrl}/shipping-address/${id}`,
      data
    );
  }

  getCreditTermsById(id: string): Observable<any> {
    return this.http.get(`${this.baseApiUrl}/shipping-address/${id}`);
  }

  delete(id: string): Observable<any> {
    const httpOptionsToken = {
      headers: new HttpHeaders({
      }),
    };

    return this.http.delete(
      `${this.baseApiUrl}/shipping-address/${id}`,
      httpOptionsToken
    );
  }
}
