import React, { useMemo } from "react"
import { mutate } from "swr";
import { ApiGetReconciliation, EnumApi, ICostType, IExpense, IIncome, IReconciliation } from "../../core";
import { ApiCreateReconciliation } from "../../core/apis/ApiCreateReconciliation";
import { ApiUpdateReconciliation } from "../../core/apis/ApiUpdateReconciliation";
import { EditableField } from "./editableField";

interface IIncomeCostViewProps{
    selectedYear:number;
    incomes:IIncome[];
    expenses:IExpense[];
    reconciliations:IReconciliation[];
    costTypes:ICostType[];
}

function IncomeCostViewComponent(props:IIncomeCostViewProps){
    const monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
    const incomesByMonths = useMemo(()=>{
        return props.incomes.reduce((group, income,i) => {
            const month = new Date(income.date).getMonth() ;
            group[month] = group[month] ?? [];
            group[month].push(income);
            return group;
          }, {} as {[key:number]:IIncome[]});
        
    },[props.incomes]);

    const getTotalIncomeOfMonth=(monthIndex:number)=>{
        return incomesByMonths[monthIndex]?.reduce((acc,curr)=> acc+curr.value,0) || 0;
    }

    const getCumulativeIncome=(monthIndex:number)=>{
        let cummSum = 0;
        for(let i = 0;i <= monthIndex;i++){
            cummSum += incomesByMonths[i]?.reduce((acc,curr)=> acc+curr.value,0) || 0
        }

        return cummSum;
    }

    const costsByMonths = useMemo(()=>{
        return props.expenses.reduce((group, expense,i) => {
            const month = new Date(expense.date).getMonth() ;
            group[month] = group[month] ?? [];
            group[month].push(expense);
            return group;
          }, {} as {[key:number]:IExpense[]});
        
    },[props.incomes]);

    const getTotalExpenseOfMonth=(monthIndex:number)=>{
        return costsByMonths[monthIndex]?.reduce((acc,curr)=> acc+curr.value,0) || 0;
    }

    const getCumulativeExpenses=(monthIndex:number)=>{
        let cummSum = 0;
        for(let i = 0;i <= monthIndex;i++){
            cummSum += costsByMonths[i]?.reduce((acc,curr)=> acc+curr.value,0) || 0
        }

        return cummSum;
    }

    const reconciliationByMonths = useMemo(()=>{
        return props.reconciliations.reduce((group, rec) => {
            const month = new Date(rec.date).getMonth() ;
            group[month] = group[month] ?? [];
            group[month].push(rec);
            return group;
          }, {} as {[key:number]:IReconciliation[]});
        
    },[props.reconciliations]);

    const getCostTypes=()=>{
        const costTypes = props.reconciliations.map(x=>x.costType);
        return costTypes.filter((x,i,arr)=> arr.findIndex(c=>c.id == x.id) === i); //make distinct
    }

    const costTypesOfIncome = useMemo(()=>{
        return props.costTypes.filter(x=>x.isIncome);
    },[props.reconciliations])

    const costTypesOfExpense = useMemo(()=>{
        return props.costTypes.filter(x=>!x.isIncome);
    },[props.reconciliations])

    const getIncomeReconciliationByMonthAndType = (monthIndex:number,costId:number)=>{
        return reconciliationByMonths[monthIndex]?.find(x=>x.costType?.id == costId && !!x.isIncome)?.value || 0;
    }

    const getExpenseReconciliationByMonthAndType = (monthIndex:number,costId:number)=>{
        return reconciliationByMonths[monthIndex]?.find(x=>x.costType?.id == costId && !x.isIncome)?.value || 0;
    }

    const GetReconciliationResult = (monthIndex:number)=>{
        const result = (reconciliationByMonths[monthIndex]?.filter(x=>!!x.isIncome).map(x=>x.value).reduce((acc,cur)=>acc+cur,0) || 0)-
                        (reconciliationByMonths[monthIndex]?.filter(x=>!x.isIncome).map(x=>x.value).reduce((acc,cur)=>acc+cur,0) || 0);
        return result;
    }

    const getCumulativeFinalResult=(monthIndex:number)=>{
        let cummResult = 0;
        for(let i = 0;i <= monthIndex;i++){
            cummResult += GetReconciliationResult(i)+getTotalIncomeOfMonth(i) - getTotalExpenseOfMonth(i) || 0
        }

        return cummResult;
    }

    const handleUpdate=(value:number,reconciliationId:number,costType:ICostType,monthIndex:number,isIncome:boolean)=>{
        const reconciliation = props.reconciliations.find(x=>x.id == reconciliationId)!;
        if(!reconciliation){
            const newRecon = {
                costTypeId:costType.id,
                costType:costType,
                date:new Date(props.selectedYear,monthIndex).toISOString(),
                isIncome,
                value           
            } as IReconciliation;
            ApiCreateReconciliation(newRecon).then(res=>{
                if(res.response){
                    ApiGetReconciliation(new Date(props.selectedYear,0),new Date(props.selectedYear,11,31,23,59,59)).then(res=>{
                        if(res.response){
                            mutate(EnumApi.GetReconciliation,
                                res.response?.data,{revalidate:true})
                        }
                        
                    })
                    
                }
            }) 

        }
        reconciliation.value = value;
        ApiUpdateReconciliation(reconciliation).then(res=>{
            if(res.response){
                ApiGetReconciliation(new Date(props.selectedYear,0),new Date(props.selectedYear,11,31,23,59,59)).then(res=>{
                    if(res.response){
                        mutate(EnumApi.GetReconciliation,
                            reconciliation,{revalidate:true})
                    }
                })
                
            }
        });
    }

    return <div>
        <table >
            <tr>
                <td align="center" colSpan={14}>Year {props.selectedYear} </td>
            </tr>
            <tr>
                <td /> <td/>
                {monthNames.map((v)=>(
                    <td key={v}>{v}</td>
                ))}
            </tr>
            <tr>
                <td/>
                <td>Income</td>
                {monthNames.map((v,i)=>(
                    <td key={v}>{getTotalIncomeOfMonth(i)}</td>
                ))}
            </tr>

            <tr>
                <td/>
                <td>Cumulative Income</td>
                {monthNames.map((v,i)=>(
                    <td key={v}>{getCumulativeIncome(i)}</td>
                ))}
            </tr>

            <tr>
                <td/>
                <td>Cost</td>
                {monthNames.map((v,i)=>(
                    <td key={v}>{getTotalExpenseOfMonth(i)}</td>
                ))}
            </tr>
            <tr>
                <td/>
                <td>Cumulative Cost</td>
                {monthNames.map((v,i)=>(
                    <td key={v}>{getCumulativeExpenses(i)}</td>
                ))}
            </tr>
            <tr>
                <td />
                <td> <b>Result</b></td>
                {monthNames.map((v,i)=>(
                    <td key={v}><b>{getTotalIncomeOfMonth(i) - getTotalExpenseOfMonth(i)}</b> </td>
                ))}
            </tr>
            <tr>
                <td colSpan={14} align="center" > <b>Reconciliation</b> </td>
            </tr>

            <tr>
               <td rowSpan={costTypesOfIncome.length}>Income</td> 
                    <td>{costTypesOfIncome[0]?.name}</td>
                    {monthNames.map((x,i)=>(
                        <td key={x}>
                            <EditableField value={getIncomeReconciliationByMonthAndType(i,costTypesOfIncome[0]?.id)}
                             handleUpdate= {v=> handleUpdate(v,reconciliationByMonths[i]?.find(x=>x.costType?.id == costTypesOfIncome[0]?.id && !!x.isIncome)?.id!,
                             costTypesOfIncome[0],i,true)}/>                            
                        </td>
                        
                    ))}
            </tr>
            {costTypesOfIncome.slice(1).map(ct=>(
                <tr>
                    <td>{ct.name}</td>
                    {monthNames.map((m,i)=>(
                        <td>
                            <EditableField value={getIncomeReconciliationByMonthAndType(i,ct.id)}
                             handleUpdate= {v=> handleUpdate(v,reconciliationByMonths[i]?.find(x=>x.costType?.id == ct.id && !!x.isIncome)?.id!,
                             ct,i,true)}/>                            
                            </td>
                    ))}
                </tr>
            ))}

            <tr>
               <td rowSpan={costTypesOfExpense.length}>Expense</td> 
                    <td>{costTypesOfExpense[0]?.name}</td>
                    {monthNames.map((x,i)=>(
                        <td>
                            <EditableField value={getExpenseReconciliationByMonthAndType(i,costTypesOfExpense[0]?.id)}
                             handleUpdate= {v=> handleUpdate(v,reconciliationByMonths[i]?.find(x=>x.costType?.id == costTypesOfExpense[0].id && !!x.isIncome)?.id!,
                                costTypesOfExpense[0],i,true)}/>  
                        </td>
                        
                    ))}
            </tr>
            {costTypesOfExpense.slice(1).map(ct=>(
                <tr>
                    <td>{ct.name}</td>
                    {monthNames.map((m,i)=>(
                        <td>{
                            <EditableField value={getExpenseReconciliationByMonthAndType(i,ct.id)}
                             handleUpdate= {v=> handleUpdate(v,reconciliationByMonths[i]?.find(x=>x.costType?.id == ct.id && !!x.isIncome)?.id!,
                                ct,i,true)}/>                              
                            }</td>
                    ))}
                </tr>
            ))}

            <tr>
                <td />
                <td><b>Reconciliation Result</b></td>
                {monthNames.map((m,i)=>(
                    <td>{GetReconciliationResult(i)}</td>
                ))}
            </tr>

            <tr>
                <td/>
                <td><b>Final Result</b></td>
                {monthNames.map((m,i)=>(
                    <td>{GetReconciliationResult(i)+getTotalIncomeOfMonth(i) - getTotalExpenseOfMonth(i)}</td>
                ))}
            </tr>

            <tr>
                <td />
                <td>
                    <b>Cumulative Final Result</b>
                </td>
                {monthNames.map((m,i)=>(
                    <td>{getCumulativeFinalResult(i)}</td>
                ))}
            </tr>
           
        </table>
    </div>
}

export const IncomeCostView = React.memo(IncomeCostViewComponent);