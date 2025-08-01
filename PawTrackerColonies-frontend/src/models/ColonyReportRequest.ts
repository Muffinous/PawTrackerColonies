import { CatReportEntryRequest } from "./CatReportEntryRequest";

export interface ColonyReportRequest {
  colonyId: string;              
  title: string;
  catsFed: CatReportEntryRequest[];
  catsMissing: CatReportEntryRequest[];
  userId: string;                
  datetime: string;             
}