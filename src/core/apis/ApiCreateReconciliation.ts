import { ApiRoutes } from "../../config";
import { Intercept } from "../intercepts";
import { IApiResult, IReconciliation } from "../types";


export function ApiCreateReconciliation(payload:IReconciliation){
    return Intercept.post<IApiResult<IReconciliation>>(`${ApiRoutes.CreateReconciliation}`,payload);
}