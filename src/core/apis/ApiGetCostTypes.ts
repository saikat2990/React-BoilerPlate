
import { ApiRoutes } from "../../config";
import { Intercept } from "../intercepts";
import { IApiResult, ICostType } from "../types";

export function ApiGetCostTypes(){
    return Intercept.get<IApiResult<ICostType[]>>(`${ApiRoutes.GetCostTypes}`);
}