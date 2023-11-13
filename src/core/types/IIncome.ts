import { ICostType } from "./ICostType"

export interface IIncome{
    value: number
    date: string
    costType: ICostType
    costTypeId: number
    id: number    
}