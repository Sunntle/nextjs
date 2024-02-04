import { IToplist } from "./types.d";
export interface IError{
  message: string,
  status: number
}
export interface ICommonProps {
  params: {
    lng: string;
  };
}

export interface ICoinInfo {
  CoinInfo: {
    Id: string;
    Name: string;
    FullName: string;
    Internal: string;
    ImageUrl: string;
    Url: string;
    Algorithm?: string;
    ProofType?: string;
    Rating?: { Weiss: { Rating: string; TechnologyAdoptionRating: string } };
    MaxSupply: number;
    Type: number;
    DocumentType?: string;
    [key: string]: string | number;
  };
  RAW: [{ [key: string]: string }];
  DISPLAY: {
    [key: string]: {
      [key: string]: string;
    };
  };
}
export interface IToplist {
  count: number;
  data: ICoinInfo[];
}

export interface INewToken {
  count: number;
  page: number;
  page_size: number;
  data: [{[key:string]: string | number}]
}

export interface IResponseToplist {
  Message: string;
  Type: Number;
  MetaData: { Count: number };
  SponsoredData: [];
  Data: [ICoinInfo];
  RateLimit: {};
  HasWarning: false;
}
export interface IResponseNewToken {
  Data: {
    STATS:{PAGE: number, TOTAL_SIZE:number, TOTAL_ASSETS:number};
    LIST: [{[key:string]: string | number}]
  };
  Err: {type: number, message: string, other_info: {param: string, allowed_values: string[]}}
}
