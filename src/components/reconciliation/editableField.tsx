import React, { useEffect, useState } from "react"
interface IProps{
    value:number;
    handleUpdate:(value:number)=>void;
}

function EditableFieldComponent(props:IProps){
    const [value,setValue]=useState<string>("");

    useEffect(()=>{
        setValue(props.value+"");
    },[props.value]);
    return <input type={"text"} value={value} onChange={e=>setValue(e.target.value)} onBlur={_=> props.handleUpdate(Number(value))} />
}

export const EditableField = React.memo(EditableFieldComponent)