import { Injectable } from "@angular/core";
import { Observable, of as observableOf } from "rxjs";
import { delay } from "rxjs/operators";
import { Company, CompanyListData, Card, ListPager } from "../data/companyList";
// import { ListDataService } from './brand-data.service';
import { environment } from "src/environments/environment";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Department, DepartmentListData } from "../data/departmentList";
import { PageParam, SearchParam } from "../data/searchFormData";

const baseUrl = environment.baseUrl2;

@Injectable()
export class DepartmentDataService extends DepartmentListData {
  baseApiUrl: string;
  constructor(private http: HttpClient) {
    super();
    this.baseApiUrl = environment.baseUrl2;
  }

  private searchParams = {
    filters: [
      {
        field: "departmentName",
        operator: "match",
        value: "",
      },
      {
        field: "contactPerson",
        operator: "match",
        value: "",
      },
      {
        field: "contactNo",
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
    this.searchParams = {
      filters: [
        {
          field: "departmentName",
          operator: "match",
          value: "",
        },
        {
          field: "contactPerson",
          operator: "match",
          value: "",
        },
        {
          field: "contactNo",
          operator: "match",
          value: "",
        },
      ],
    };

    this.pageParams = {
      pageNo: "",
      pageSize: "",
      sortBy: "",
      sortDir: "",
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
  }

  setPageParams(pageParams: PageParam) {
    this.pageParams = pageParams;
    console.log(this.pageParams);
  }

  private departmentListData: Department[] = [];

  getDepartmentList() {
    const httpOptionsToken = {
      params: new HttpParams({
        fromObject: this.pageParams,
      }),
    };

    return this.http.post(
      `${this.baseApiUrl}/departments`,
      this.searchParams,
      httpOptionsToken
    );
  }

  addDepartment(data: Company) {
    return this.http.post(`${this.baseApiUrl}/department`, data);
  }

  updateDepartment(id: string, data: Company): Observable<any> {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        // "Content-Type": "application/json",
      }),
    };
    return this.http.put(
      `${this.baseApiUrl}/department/${id}`,
      data,
      httpOptionsToken
    );
  }

  getDepartmentById(id: string): Observable<any> {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        // "Content-Type": "application/json",
      }),
    };

    return this.http.get(
      `${this.baseApiUrl}/department/${id}`,
      httpOptionsToken
    );
  }
}
