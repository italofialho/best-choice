import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import { auth, db } from "../../firebase";
import * as routes from "../../constants/routes";

import { PasswordForgetLink } from "../PasswordForget";
import logoImg from "../Images/logo.png";

import * as Halogenium from "halogenium";
import { toast } from "react-toastify";
import moment from "moment";

const SignInPage = ({ history }) => <SignInForm history={history} />;

const INITIAL_STATE = {
    email: "",
    password: "",
    error: null,
    result: null,
    loginStatus: "Entrar",
    processing: false,
};

class SignInForm extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    componentDidMount() {
        const { history } = this.props;

        if (localStorage.getItem("userId") !== null) {
            history.push(routes.DASHBOARD);
        } else {
            history.push(routes.SIGN_IN);
        }
    }

    onSubmit = (event) => {
        this.setState({ processing: true, loginStatus: "Entrando ..." });

        const { email, password } = this.state;

        const { history } = this.props;

        this.setState({ error: null });

        auth
            .doSignInWithEmailAndPassword(email, password)
            .then((snapshot) => {
                db.onceGetUsers(snapshot.uid).then((user) => {
                    this.setState({ processing: false });
                    let authUser = user.val();
                    if (user.val() != null){
                        db.refNode(`Users/${authUser.uid}`).update({
                            lastLogin: moment().valueOf(),
                        });

                        localStorage.setItem("userId", authUser.uid);
                        localStorage.setItem("userType", authUser.type);

                        history.push(routes.DASHBOARD);
                    }
                });
            })
            .catch((error) => {
                this.setState({
                    processing: false,
                    loginStatus: "Entrar",
                    error: error,
                });
            });

        event.preventDefault();
    };

    render() {
        const {
            email,
            password,
            error,
            result,
            loginStatus,
            processing,
        } = this.state;

        const isInvalid =
            password === "" || password.length < 6 || email === "";

        var color = "#010C28";

        var style = {
            display: "flex",
            WebkitFlex: "0 1 auto",
            flex: "0 1 auto",
            WebkitFlexDirection: "column",
            flexDirection: "column",
            WebkitFlexGrow: 1,
            flexGrow: 1,
            WebkitFlexShrink: 0,
            flexShrink: 0,
            WebkitAlignItems: "center",
            alignItems: "center",
            WebkitJustifyContent: "center",
            justifyContent: "center",
            marginBottom: "6%",
        };

        return (
            <div className="background-img">
                <div className="col-md-12">
                    <div className="container">
                        <div className="card-form card-form-container">
                            <img
                                id="profile-img"
                                className="img-responsive center-block"
                                src={logoImg}
                                alt="Best Choice"
                                width="35%"
                            />

                            {result && (
                                <div className="alert alert-success">
                                    <b>Feito !</b>
                                    {result}
                                </div>
                            )}
                            {error && (
                                <div className="alert alert-danger text-center">
                                    <b>Erro !</b>
                                    {error.message}
                                </div>
                            )}
                            <form
                                className="form-signin"
                                onSubmit={this.onSubmit}>
                                <span
                                    id="reauth-email"
                                    className="reauth-email"
                                />
                                <input
                                    type="email"
                                    id="inputEmail"
                                    className="form-control"
                                    placeholder="Email"
                                    value={email}
                                    required="required"
                                    autoFocus="autoFocus"
                                    onChange={(event) =>
                                        this.setState({
                                            email: event.target.value,
                                        })
                                    }
                                />
                                <input
                                    type="password"
                                    id="inputPassword"
                                    className="form-control"
                                    placeholder="Senha"
                                    value={password}
                                    required="required"
                                    onChange={(event) =>
                                        this.setState({
                                            password: event.target.value,
                                        })
                                    }
                                />

                                <div className="col-md-12">
                                    {processing && (
                                        <div style={style}>
                                            <Halogenium.PulseLoader
                                                color={color}
                                            />
                                        </div>
                                    )}
                                </div>
                                <button
                                    className="btn-btn btn-lg btn-primary btn-block btn-signin"
                                    disabled={isInvalid}
                                    type="submit">
                                    {loginStatus}
                                </button>
                            </form>
                            <PasswordForgetLink />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(SignInPage);

export { SignInForm };
