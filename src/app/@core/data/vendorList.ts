import { Observable } from "rxjs";

export interface Vendor {
  brandId?: string;
  vendorCode?: string;
  vendorName?: string;
  phone?: string;
  updatedAt?: any;
  createdAt?: any;
}

export interface ListPager {
  pageSize?: number;
  pageIndex?: number;
}

export interface CardAction {
  icon?: string;
  num?: string;
}

export interface Card {
  name?: string;
  id?: number;
  ame?: string;
  title?: string;
  imgSrc?: string;
  subTitle?: string;
  content?: string;
  agreeNum?: number;
  starsNum?: number;
  messageNum?: number;
  actions?: CardAction[];
}

export abstract class VendorListData {
  // abstract getBrandList(pager: ListPager): Observable<Brand[]>;
  // abstract getOriginSource(pager: ListPager): Observable<Brand[]>;
  // abstract getTreeSource(pager: ListPager): Observable<Brand[]>;
}
