import { Observable } from "rxjs";

export interface CurrencyRate {
  exchagneRateId?: string;
  fromCurrency?: string;
  toCurrency?: string;
  rate?: number;
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

export class CurrencyList{
  currencyCode?: string;
}

export abstract class CurrencyListData {
  currencyCode?: string;
  rate?:string;
  // abstract getBrandList(pager: ListPager): Observable<Brand[]>;
  // abstract getOriginSource(pager: ListPager): Observable<Brand[]>;
  // abstract getTreeSource(pager: ListPager): Observable<Brand[]>;
}
