import { Observable } from "rxjs";

export interface Company {
  companyId?: string;
  companyName?: string;
  address?: string;
  updatedAt?: any;
  createdAt?: string;
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

export abstract class CompanyListData {
  // abstract getBrandList(pager: ListPager): Observable<Brand[]>;
  // abstract getOriginSource(pager: ListPager): Observable<Brand[]>;
  // abstract getTreeSource(pager: ListPager): Observable<Brand[]>;
}
