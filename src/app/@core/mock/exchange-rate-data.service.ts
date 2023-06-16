import { Injectable } from "@angular/core";
import { Observable, of as observableOf } from "rxjs";
import { delay } from "rxjs/operators";
import { Company, CompanyListData, Card, ListPager } from "../data/companyList";
// import { ListDataService } from './brand-data.service';
import { environment } from "src/environments/environment";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { ExchangeRate, ExchangeRateListData } from "../data/exchangeRateList";
import { PageParam, SearchParam } from "../data/searchFormData";

@Injectable({
  providedIn: "root",
})
export class ExchangeRateDataService extends ExchangeRateListData {
  baseApiUrl: string;
  constructor(private http: HttpClient) {
    super();
    this.baseApiUrl = environment.baseUrl4;
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

  private exchangeRateListData: ExchangeRate[] = [];

  getExchangeRateList() {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        // "Content-Type": "application/json",
      }),
      params: new HttpParams({
        fromObject: this.pageParams,
      }),
    };

    return this.http.post(
      `${this.baseApiUrl}/currency/list`,
      this.searchParams,
      httpOptionsToken
    );
  }

  addExchangeRate(data: ExchangeRate) {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        // "Content-Type": "application/json",
      }),
    };
    // console.log("data=============", data);
    return this.http.post(`${this.baseApiUrl}/currency`, data);
  }

  updateExchangeRate(id: string, data: ExchangeRate): Observable<any> {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.http.put(`${this.baseApiUrl}/currency/${id}`, data, httpOptionsToken);
  }

  getExchangeRateById(id: string): Observable<any> {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.http.get(`${this.baseApiUrl}/currency/${id}`, httpOptionsToken);
  }

  statusToggle(data: any) {
    return this.http.put(
      `${this.baseApiUrl}/currency/${data.id}/${data.active}`,
      ""
    );
  }
}
