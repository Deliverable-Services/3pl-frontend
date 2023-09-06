import { Injectable } from "@angular/core";
import { Observable, of as observableOf } from "rxjs";
import { delay } from "rxjs/operators";
import { Card, ListPager, CategoryListData } from "../data/categoryList";
import { Season } from "../data/season";
import { Category } from "../data/categoryList";
// import { ListDataService } from './brand-data.service';
import { environment } from "src/environments/environment";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { PageParam, SearchParam } from "../data/searchFormData";

const baseUrl = environment.baseUrl;

@Injectable()
export class CategoryListDataService extends CategoryListData {
  baseApiUrl: string;
  constructor(private http: HttpClient) {
    super();
    console.log('burl',environment.baseUrl);
    
    this.baseApiUrl = 'http://btv-private-module-backend-logicloud-qa.apps.nonprod2-openshift-cluster.internal.logi-cloud.com/api/v1';
  }

  private searchParams = {
    filters: [
      {
        field: "categoryName",
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

  addCategory(data: any): Observable<any> {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.http.post(
      `${this.baseApiUrl}/category`,
      data,
      httpOptionsToken
    );
  }

  getCategoryList(): Observable<any> {
    const httpOptionsToken = {
      params: new HttpParams({
        fromObject: this.pageParams,
      }),
    };

    return this.http.post(
      `${this.baseApiUrl}/category/list`,
      this.searchParams,
      httpOptionsToken
    );
  }

  getCategoryListActive(data?: any) {

    // const searchParams = {
    //   filters: [
    //     {
    //       field: "isActive",
    //       operator: "equal",
    //       value: true,
    //     },
    //   ],
    // };

    const searchParams = {
      filters: [
          {
              field: "categoryName",
              operator: "match",
              value: ""
          }
      ]
    }

    let catUri;
    if(data) {
      catUri = `${this.baseApiUrl}/category/list?pageSize=${data.perPage}`;
    } else {
      catUri = `${this.baseApiUrl}/category/list`;
    }

    return this.http.post(
      catUri,
      searchParams
    );
  }

  updateCategory(id: string, data: any): Observable<any> {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        // "Content-Type": "application/json",
      }),
    };

    return this.http.put(
      `${this.baseApiUrl}/category/${id}`,
      data,
      httpOptionsToken
    );
  }

  getCategoryById(id: string): Observable<any> {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        // "Content-Type": "application/json",
      }),
    };

    return this.http.get(`${this.baseApiUrl}/category/${id}`, httpOptionsToken);
  }

  addSubCategory(id: string, data: any): Observable<any> {
    // const httpOptionsToken = {
    //   headers: new HttpHeaders({
    //     // "Content-Type": "application/json",
    //   }),
    // };

    return this.http.post(
      `${this.baseApiUrl}/category/${id}/subcategory`,
      data
    );
  }

  editSubCategory(
    categoryId: string,
    data: any,
    subCategoryId: string
  ): Observable<any> {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        // "Content-Type": "application/json",
      }),
    };

    return this.http.put(
      `/category/${categoryId}/subcategory/${subCategoryId}`,
      data,
      httpOptionsToken
    );
  }

  statusToggle(data: any) {
    return this.http.put(
      `${this.baseApiUrl}/category/${data.categoryId}/${data.active}`,
      ""
    );
  }

  statusToggleSubCat(data: any) {
    return this.http.put(
      `${this.baseApiUrl}/category/${data.categoryId}/subcategory/${data.subcategoryId}/${data.active}`,
      ""
    );
  }
}
