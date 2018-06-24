import React from "react";
import * as routes from "../../constants/routes";
import { auth } from "../../firebase";
import { Link, withRouter } from "react-router-dom";

const SignOutButton = () => {
    return (
        <button
            className="btn btn-default"
            type="button"
            onClick={auth.doSignOut}>
            Sair
        </button>
    );
};

const LogoutLink = () => (
    <Link className="menu-link" to={routes.LOGOUT}>
        <i className="fas fa-sign-out-alt" aria-hidden="true" />
        Sair
    </Link>
);

const LogoutPage = withRouter(({ history }) => {
    auth.doSignOut().then(() => {
        localStorage.clear();
        history.push(routes.SIGN_IN);
    });

    return (
        <div className="container">
            <h2 className="text-center">Saindo ...</h2>
        </div>
    );
});

export default SignOutButton;

export { SignOutButton, LogoutLink, LogoutPage };
