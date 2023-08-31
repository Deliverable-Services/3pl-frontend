import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { CurrencyRate } from "../data/CurrencyList";
import { PageParam, SearchParam } from "../data/searchFormData";

@Injectable({
  providedIn: "root",
})
export class ShippingPartnerService {
  baseApiUrl: string;
  constructor(private http: HttpClient) {
    this.baseApiUrl = environment.baseUrl4;
  }

  private searchParams = {
    filters: [
      {
        field: "address",
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

  getList() {
    const httpOptionsToken = {
      headers: new HttpHeaders({
      }),
      params: new HttpParams({
        fromObject: this.pageParams,
      }),
    };

    return this.http.post(
      `${this.baseApiUrl}/shipping-partners/list`,
      this.searchParams,
      httpOptionsToken
    );
  }

  add(data: CurrencyRate) {
    return this.http.post(`${this.baseApiUrl}/shipping-partners`, data);
  }

  update(id: string, data: CurrencyRate): Observable<any> {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.http.put(`${this.baseApiUrl}/shipping-partners/${id}`, data, httpOptionsToken);
  }

  getById(id: string): Observable<any> {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.http.get(`${this.baseApiUrl}/shipping-partners/${id}`, httpOptionsToken);
  }

  delete(id: any) {
    return this.http.delete(`${this.baseApiUrl}/shipping-partners/${id}`);
  }
}
