import { Injectable } from "@angular/core";
import { Observable, of as observableOf } from "rxjs";
import { delay } from "rxjs/operators";
import { Company, CompanyListData, Card, ListPager } from "../data/companyList";
// import { ListDataService } from './brand-data.service';
import { environment } from "src/environments/environment";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";

const baseUrl = environment.baseUrl2;

@Injectable()
export class CompanyDataService extends CompanyListData {
  baseApiUrl: string;
  constructor(private http: HttpClient) {
    super();
    this.baseApiUrl = environment.baseUrl2;
    console.log(this.baseApiUrl);
  }

  private companyListData: Company[] = [];

  private pagerList(data: Company[] | Card[], pager: ListPager) {
    return data.slice(
      pager.pageSize! * (pager.pageIndex! - 1),
      pager.pageSize! * pager.pageIndex!
    );
  }

  getCompanyList(params: any, searchParams: any): Observable<any> {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        // "Content-Type": "application/json",
      }),
      params: new HttpParams({
        fromObject: params,
      }),
    };

    // const searchData = {
    //   filters: [
    //     {
    //       field: "companyCode",
    //       operator: "match",
    //       value: searchParams,
    //     },
    //   ],
    // };

    return this.http.get(`${this.baseApiUrl}/company`, httpOptionsToken);
  }

  addCompany(data: Company) {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        // "Content-Type": "application/json",
      }),
    };
    // console.log("data=============", data);
    return this.http.post(`${this.baseApiUrl}/company`, data);
  };

  updateCompany(id: string, data: Company): Observable<any> {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        // "Content-Type": "application/json",
      }),
    };

    return this.http.put(`${this.baseApiUrl}/company`, data, httpOptionsToken);
  }

  getCompanyById(id: string): Observable<any> {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        // "Content-Type": "application/json",
      }),
    };

    return this.http.get(`${this.baseApiUrl}/company`, httpOptionsToken);
  }

  getOriginSource(pager: ListPager): Observable<any> {
    return observableOf({
      pageList: this.pagerList(this.companyListData, pager),
      total: this.companyListData.length,
    }).pipe(delay(1000));
  }

  getTreeSource(pager: ListPager): Observable<any> {
    return observableOf({
      pageList: this.pagerList(this.companyListData, pager),
      total: this.companyListData.length,
    }).pipe(delay(1000));
  }
}
