import { ICostType } from "./ICostType"

export interface IReconciliation {
    value: number
    date: string
    costType: ICostType
    costTypeId: number
    id: number
    isIncome: boolean;
}