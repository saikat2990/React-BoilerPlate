import { ApiRoutes } from "../../config";
import { Intercept } from "../intercepts";
import { IApiResult, IIncome } from "../types";

export function ApiGetIncomes(startDate:Date,endDate:Date){
    return Intercept.get<IApiResult<IIncome[]>>(`${ApiRoutes.GetIncomesByDateRange}?fromDate=${startDate.toISOString()}&toDate=${endDate.toISOString()}`);
}