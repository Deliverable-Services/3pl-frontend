import { Injectable } from "@angular/core";
import { Observable, of as observableOf } from "rxjs";
import { delay } from "rxjs/operators";
import { Brand, BrandListData, Card, ListPager } from "../data/brandList";
import { Season } from "../data/season";
// import { ListDataService } from './brand-data.service';
import { environment } from "src/environments/environment";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { VendorListData } from "../data/vendorList";
import { TradeTerm, TradeTermListtData } from "../data/tradeTermList";
import { PageParam, SearchParam } from "../data/searchFormData";

const baseUrl = environment.baseUrl;

@Injectable()
export class TradeListDataService extends TradeTermListtData {
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
  }

  private tradeTermList: TradeTerm[] = [];

  private pagerList(data: TradeTerm[] | Card[], pager: ListPager) {
    return data.slice(
      pager.pageSize! * (pager.pageIndex! - 1),
      pager.pageSize! * pager.pageIndex!
    );
  }

  getTradeList() {
    const httpOptionsToken = {
      headers: new HttpHeaders({}),
      params: new HttpParams({
        fromObject: this.pageParams,
      }),
    };

    return this.http.post("/tradeterms", this.searchParams, httpOptionsToken);
  }

  addTrade(data: any) {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        // "Content-Type": "application/json",
      }),
    };
    console.log("data=============", data);
    return this.http.post("/tradeterm", data);
  }

  updateTrade(id: string, data: any): Observable<any> {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        // "Content-Type": "application/json",
      }),
    };

    return this.http.put(`/tradeterm/${id}`, data, httpOptionsToken);
  }

  getTradeById(id: string): Observable<any> {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        // "Content-Type": "application/json",
      }),
    };

    return this.http.get(`/tradeterm/${id}`, httpOptionsToken);
  }

  getOriginSource(pager: ListPager): Observable<any> {
    return observableOf({
      pageList: this.pagerList(this.tradeTermList, pager),
      total: this.tradeTermList.length,
    }).pipe(delay(1000));
  }

  getTreeSource(pager: ListPager): Observable<any> {
    return observableOf({
      pageList: this.pagerList(this.tradeTermList, pager),
      total: this.tradeTermList.length,
    }).pipe(delay(1000));
  }
}
