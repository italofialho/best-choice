import React, { Component } from "react";
import { Link } from "react-router-dom";

import { auth } from "../../firebase";
import * as routes from "../../constants/routes";
import * as Halogenium from "halogenium";
import logoImg from "../Images/logo.png";

const PasswordForgetPage = () => <PasswordForgetForm />;

const INITIAL_STATE = {
    email: "",
    error: null,
    result: null,
    processing: false,
};

class PasswordForgetForm extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    onSubmit = (event) => {
        const { email } = this.state;
        this.setState({ processing: true });
        auth
            .doPasswordReset(email)
            .then(() => {
                this.setState({
                    processing: false,
                    result:
                        "Enviamos um email com as instruções para recuperar a sua senha.",
                });
            })
            .catch((error) => {
                this.setState({ processing: false, error: error });
            });

        event.preventDefault();
    };

    render() {
        const { email, error, result, processing } = this.state;

        const isInvalid = email === "";

        var color = "#FCC410";
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
                                width="35%"
                                alt="Best Choice"
                            />
                            {result && (
                                <div className="alert alert-success text-center">
                                    <b>Feito ! </b>
                                    {result}
                                </div>
                            )}
                            {error && (
                                <div className="alert alert-danger text-center">
                                    <b>Erro ! </b>
                                    {error.message}
                                </div>
                            )}
                            <form
                                className="form-forgotPassword"
                                onSubmit={this.onSubmit}>
                                <input
                                    className="form-control"
                                    value={this.state.email}
                                    id="inputEmail"
                                    onChange={(event) =>
                                        this.setState({
                                            email: event.target.value,
                                        })
                                    }
                                    type="email"
                                    placeholder="Email"
                                    required="required"
                                    autoFocus="autoFocus"
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
                                    disabled={isInvalid}
                                    type="submit"
                                    className="btn-souls">
                                    Recuperar a senha
                                </button>
                                <Link to={routes.SIGN_IN}>
                                    Voltar para o login
                                </Link>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const PasswordForgetLink = () => (
    <p>
        <Link to={routes.PASSWORD_FORGET}>Esqueceu a senha?</Link>
    </p>
);

export default PasswordForgetPage;

export { PasswordForgetForm, PasswordForgetLink };
