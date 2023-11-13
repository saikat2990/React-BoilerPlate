import React from "react"
import { Button } from "react-bootstrap";
import { Redirect, useHistory } from "react-router";
import useSWR from "swr";
import { UiRoutes } from "../../config/UIRoutes";
import { ApiGetUser, EnumApi } from "../../core";
import { AppStorage } from "../../lib";

function HomeDemoComponent(){
    const history = useHistory();
    const {data, isValidating} = useSWR(EnumApi.GetUser,  {
        fetcher:async ()=> await ApiGetUser("2"),
        revalidateOnFocus:false,
    });

    const user = data?.response?.data;
    const handleLogout = ()=>{
        localStorage.clear();
        history.push(UiRoutes.HomeDemo);
    }
  
    if(isValidating) return <p className="text-center">Loading...</p>

    //if(!AppStorage.getAccessToken()) return <Redirect to={UiRoutes.LoginDemo} />
    return <div className="h-100 d-flex justify-content-center align-items-center">
        {!!user && <div>
            <div>
                <img src={user.avatar} alt="profile-image" />
            </div>
            <p>Name: {user.first_name} {user.last_name}</p>    
            <p>Email: {user.email}</p>            
            
            <div className="text-center py-2">
                <Button onClick={handleLogout}>Logout</Button>
            </div>
        </div>}
    </div>
}

export const HomeDemo = React.memo(HomeDemoComponent);