import { ApiRoutes } from "../../config";
import { Intercept } from "../intercepts";
import { IApiResult, IReconciliation } from "../types";

export function ApiGetReconciliation(startDate:Date,endDate:Date){
    return Intercept.get<IApiResult<IReconciliation[]>>(`${ApiRoutes.GetReconciliationByDateRange}?fromDate=${startDate.toISOString()}&toDate=${endDate.toISOString()}`);
}