import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Package } from "../data/packageList";
import { PageParam, SearchParam } from "../data/searchFormData";
import { ShipmentHeaderData } from "../data/shipmentHeaderList";

@Injectable({
  providedIn: "root",
})
export class ShipmentDataService extends ShipmentHeaderData {
  baseApiUrl: string | undefined;

  constructor(private http: HttpClient) {
    super();
    this.baseApiUrl = environment.baseUrl3;
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

  addShipment(data: ShipmentHeaderData) {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };
    return this.http.post(`${this.baseApiUrl}/ship`, data);
  }

  updateShipment(id: any, data: any) {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };
    return this.http.put(`${this.baseApiUrl}/ship/${id}/save`, data);
  }

  getShipmentList(): Observable<any> {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),

      params: new HttpParams({
        fromObject: this.pageParams,
      }),
    };

    return this.http.post(
      `${this.baseApiUrl}/ship-list`,
      this.searchParams,
      httpOptionsToken
    );
  }

  getShipmentById(id: string): Observable<any> {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.http.get(`${this.baseApiUrl}/ship/${id}`, httpOptionsToken);
  }

  addPackage(data: Package, id: any) {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.http.post(
      `${this.baseApiUrl}/ship/${id}/package`,
      data,
      httpOptionsToken
    );
  }

  changeShipmentToSubmit(id: string, data: any): Observable<any> {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.http.put(
      `${this.baseApiUrl}/ship/${id}/submit`,
      data,
      httpOptionsToken
    );
  }

  changeShipmentToConfirm(id: string): Observable<any> {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.http.put(
      `${this.baseApiUrl}/ship/${id}/confirm`,
      httpOptionsToken
    );
  }

  changeShipmentToDispatched(id: string): Observable<any> {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.http.put(
      `${this.baseApiUrl}/ship/${id}/dispatch`,
      httpOptionsToken
    );
  }

  changeShipmentToPartial(id: string): Observable<any> {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.http.put(
      `${this.baseApiUrl}/ship/${id}/receive-partial`,
      httpOptionsToken
    );
  }

  changeShipmentToFull(id: string): Observable<any> {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return this.http.put(
      `${this.baseApiUrl}/ship/${id}/receive-full`,
      httpOptionsToken
    );
  }
}
