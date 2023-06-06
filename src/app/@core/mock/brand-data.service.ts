import { Injectable } from "@angular/core";
import { Observable, of as observableOf } from "rxjs";
import { delay } from "rxjs/operators";
import { Brand, BrandListData, Card, ListPager } from "../data/brandList";
import { Season } from "../data/season";
import { environment } from "src/environments/environment";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { PageParam, SearchParam } from "../data/searchFormData";

const baseUrl = environment.baseUrl;

@Injectable()
export class BrandListDataService extends BrandListData {
  baseApiUrl: string;
  constructor(private http: HttpClient) {
    super();
    this.baseApiUrl = environment.baseUrl;
  }
  private seasonList: Season[] = [];
  private brandListData: Brand[] = [];

  private searchParams = {
    filters: [
      {
        field: "brandName",
        operator: "match",
        value: "",
      },
      {
        field: "brandCode",
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

  resetParams() {
    this.pageParams = {
      pageNo: "",
      pageSize: "",
      sortBy: "",
      sortDir: "",
    };

    this.searchParams = {
      filters: [
        {
          field: "brandName",
          operator: "match",
          value: "",
        },
        {
          field: "brandCode",
          operator: "match",
          value: "",
        },
      ],
    };
  }

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

    console.log(this.searchParams.filters);
  }

  setPageParams(pageParams: PageParam) {
    this.pageParams = pageParams;
    console.log(this.pageParams);
  }

  getBrandList() {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
      params: new HttpParams({
        fromObject: this.pageParams,
      }),
    };

    return this.http.post(
      `${this.baseApiUrl}/brands`,
      this.searchParams,
      httpOptionsToken
    );
  }

  getBrandListActive() {
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
      `${this.baseApiUrl}/brands`,
      searchParams,
      httpOptionsToken
    );
  }

  addBrand(data: Brand) {
    const url = `${baseUrl}/save_brand`;
    const httpOptionsToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.http.post(`${this.baseApiUrl}/brand`, data);
  }
  statusToggle(data: any) {
    return this.http.put(
      `${this.baseApiUrl}/brand/${data.brandId}/${data.active}`,
      ""
    );
  }
  updateBrand(id: string, data: Brand): Observable<any> {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.http.put(`/brand/${id}`, data, httpOptionsToken);
  }
  getBrandById(id: string): Observable<any> {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.http.get(`/brand/${id}`, httpOptionsToken);
  }
  addSeason(data: Season) {
    this.seasonList.unshift(data);
    console.log({ data });
  }

  addSeasonListData(e: any) {}

  addSeasonInBrand(id: string, data: any): Observable<any> {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };
    return this.http.post(`/brand/${id}/season`, data, httpOptionsToken);
  }

  editSeasonInBrand(
    brandId: string,
    data: any,
    seasonId: string
  ): Observable<any> {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        // "Content-Type": "application/json",
      }),
    };

    return this.http.put(
      `/brand/${brandId}/season/${seasonId}`,
      data,
      httpOptionsToken
    );
  }

  statusToggleSeason(data: any) {
    return this.http.put(
      `${this.baseApiUrl}/brand/${data.brandId}/season/${data.seasonId}/${data.active}`,
      ""
    );
  }
}
