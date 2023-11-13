import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { UiRoutes } from "../../config/UIRoutes";
import {HomeDemo} from '..'

import { AppStorage } from "../../lib";
import { Reconciliation } from "../reconciliation/reconciliation";


function PrivateLayoutComponent(): JSX.Element {
  
    // if (!AppStorage.getAccessToken()) {    
    //     return (
    //         <Redirect to={{ pathname: UiRoutes.LoginDemo }} />
    //     );
    // }
    return (
        <Switch>
            <Route exact path={UiRoutes.HomeDemo} component={HomeDemo} />
            <Route exact path={UiRoutes.Reconciliation} component={Reconciliation} />
        </Switch>
    );
}

export const PrivateLayout = React.memo(PrivateLayoutComponent);
