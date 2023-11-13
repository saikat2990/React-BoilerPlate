import { ApiRoutes } from "../../config";
import { Intercept } from "../intercepts";
import { IApiResult, IExpense } from "../types";

export function ApiGetExpenses(startDate:Date,endDate:Date){
    return Intercept.get<IApiResult<IExpense[]>>(`${ApiRoutes.GetExpensesByDateRange}?fromDate=${startDate.toISOString()}&toDate=${endDate.toISOString()}`);
}