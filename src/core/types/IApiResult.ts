export interface IApiResult<T>{
    isSuccess: boolean
    data: T
    message: string
    messageDisplayType: string
    error: string
}