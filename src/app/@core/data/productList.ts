import { Observable } from "rxjs";

export interface Products {
  styleName: string;
  logisticsDesc: string;
  collection: string;
  fabricComposition: string;
  fabicSwatch: string;
  unitWeight: string;
  productCategoryId: string;
  varients?: any;
  updatedAt?: any;
  createdAt?: any;
}
export interface Product {
  productId?: string;
  productName?: string;
  sku?: string;
  color?: string;
  size?: string;
  currency?: string;
  price?: string;
  updated_at?: string;
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

export abstract class ProductListData {
  // abstract getListData(pager: ListPager): Observable<Product[]>;
  abstract getOriginSource(pager: ListPager): Observable<Product[]>;
  abstract getTreeSource(pager: ListPager): Observable<Product[]>;
}
