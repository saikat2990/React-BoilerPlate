import React from "react"

interface IYearSelectorProps{
    onChange:(year:number)=>void;
    selected:number;
}

function YearSelectorComponent(props:IYearSelectorProps){

    const years = Array.from(Array(500).keys()).map(x=> x+1900);


    return (
        <div>
            <div>
                Choose Year
            </div>
            <div>
                <select name="years" id="cars" onChange={e=> props.onChange(Number(e.target.value))}>
                    {years.map(y=>(
                        <option key={y} value={y} selected={props.selected == y} >{y}</option>
                    ))}
                </select>
            </div>
        </div>
    )
}

export const YearSelector = React.memo(YearSelectorComponent);