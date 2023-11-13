import React, { useState } from "react"
import useSWR from "swr";
import { ApiGetReconciliation, EnumApi } from "../../core";
import { ApiGetCostTypes } from "../../core/apis/ApiGetCostTypes";
import { ApiGetExpenses } from "../../core/apis/ApiGetExpenses";
import { ApiGetIncomes } from "../../core/apis/ApiGetIncomes";
import { IncomeCostView } from "./incomeCostView";
import { YearSelector } from "./yearSelector"

function ReconciliationComponent(){
    const [selectedYear,setSelectedDate]= useState<number>(new Date().getFullYear());
    const {data, isValidating} = useSWR(EnumApi.GetIncomes+selectedYear,  {
        fetcher:async ()=> await ApiGetIncomes(new Date(selectedYear,0),new Date(selectedYear,11,31,23,59,59)),
        revalidateOnFocus:false,
    });

    const {data:expenseData, isValidating:isValidatingExpenses} = useSWR(EnumApi.GetExpenses+selectedYear,  {
        fetcher:async ()=> await ApiGetExpenses(new Date(selectedYear,0),new Date(selectedYear,11,31,23,59,59)),
        revalidateOnFocus:false,
    });

    const {data:reconciliationData, isValidating:isValidatingReconciliation} = useSWR(EnumApi.GetReconciliation+selectedYear,  {
        fetcher:async ()=> await ApiGetReconciliation(new Date(selectedYear,0),new Date(selectedYear,11,31,23,59,59)),
        revalidateOnFocus:false,
    });

    const {data:costTypeData, isValidating:isValidatingCostType} = useSWR(EnumApi.GetCostType,  {
        fetcher:async ()=> await ApiGetCostTypes(),
        revalidateOnFocus:false,
    });

    console.log(data);
    console.log(selectedYear);

    const isBusy = isValidating || isValidatingExpenses || isValidatingReconciliation || isValidatingCostType;

    return (
        <div>
            <div>
                <YearSelector onChange={setSelectedDate} selected={selectedYear} />
            </div>
            <div>
                {!isBusy && !!data && !!expenseData && !!reconciliationData && !!costTypeData  && <IncomeCostView 
                selectedYear={selectedYear} incomes={data?.response?.data! || []} 
                expenses={expenseData?.response?.data!} reconciliations={reconciliationData.response?.data! || []}
                costTypes={costTypeData?.response?.data! || []}/>}
                
            </div>
        </div>
    )
}

export const Reconciliation = React.memo(ReconciliationComponent)