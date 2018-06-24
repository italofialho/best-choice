import React from "react";
import { Route, Switch, HashRouter } from "react-router-dom";

import withAuthentication from "../Session/withAuthentication";
import * as routes from "../../constants/routes";

import SignUpPage from "../SignUp";
import SignInPage from "../SignIn";
import PasswordForgetPage from "../PasswordForget";
import DashboardPage from "../Dashboard";
import NotFound from "../NotFound";
import { LogoutPage } from "../SignOut";

const App = () => (
    <HashRouter>
        <div className="app">
            <Switch>
                <Route
                    exact
                    path={routes.START}
                    component={() => <SignInPage />}
                />
                <Route
                    exact
                    path={routes.SIGN_UP}
                    component={() => <SignUpPage />}
                />
                <Route
                    exact
                    path={routes.SIGN_IN}
                    component={() => <SignInPage />}
                />
                <Route
                    exact
                    path={routes.LOGOUT}
                    component={() => <LogoutPage />}
                />
                <Route
                    exact
                    path={routes.PASSWORD_FORGET}
                    component={() => <PasswordForgetPage />}
                />
                <Route
                    exact
                    path={routes.DASHBOARD}
                    component={() => <DashboardPage />}
                />
                <Route component={() => <NotFound />} />
            </Switch>
        </div>
    </HashRouter>
);

export default withAuthentication(App);
