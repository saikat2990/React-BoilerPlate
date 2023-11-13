import { ApiRoutes } from "../../config";
import { Intercept } from "../intercepts";
import { IApiResult, IReconciliation } from "../types";

export function ApiUpdateReconciliation(payload:IReconciliation){
    return Intercept.put<IApiResult<boolean>>(`${ApiRoutes.UpdateReconciliation}`,payload);
}