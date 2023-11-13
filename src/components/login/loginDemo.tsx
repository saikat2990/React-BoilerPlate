import React from "react"
import { Button, Form } from "react-bootstrap";
import { Redirect, useHistory } from "react-router";
import { mutate } from "swr";
import { UiRoutes } from "../../config/UIRoutes";
import { ApiLoginDemo, EnumApi } from "../../core";
import { AppStorage, useMultiState } from "../../lib"

interface IState{
    isBusy:boolean;
    userName:string;
    password:string
}

function LoginDemoComponent(){
    const [state,setState]=useMultiState<IState>({isBusy:false,password:"cityslicka",userName:"eve.holt@reqres.in"});
    const history = useHistory();
    if(!!AppStorage.getAccessToken()) return <Redirect to={UiRoutes.HomeDemo} />              

    const login = ()=>{
        setState({isBusy:true})
        ApiLoginDemo(state.userName!,state.password!).then(res=>{
            setState({isBusy:false});
            if(res.response){
                AppStorage.setAccessToken(res.response.token);
                AppStorage.setUserInfo(res.response);
                mutate(EnumApi.Login,res.response);
                history.push(UiRoutes.HomeDemo);
            }
        })
    }

    return <div className="text-center d-flex justify-content-center align-items-center h-100">
        <div className="w-25">
            {state.isBusy && <div>Singing...</div>}
            <div className="py-1">
                <div>
                    <h1 className="text-info">React Skeleton</h1>
                </div>
                <Form.Control type="text" placeholder="Enter username"
                    onChange={e=>setState({userName:e.target.value})} 
                    value={state.userName} />
            </div>
            <div className="py-1">
                <Form.Control type="password" placeholder="Enter password" 
                    onChange={e=> setState({password:e.target.value})} value={state.password} />
            </div>            
            <Button className="text-center" onClick={login} disabled={state.isBusy}>Login</Button>
        </div>        
    </div>
}

export const LoginDemo = React.memo(LoginDemoComponent)
