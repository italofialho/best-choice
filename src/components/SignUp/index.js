import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import { auth, db } from "../../firebase";
import * as routes from "../../constants/routes";

import logoImg from "../Images/logo.png";

const SignUpPage = ({ history }) => (
    <div>
        <SignUpForm history={history} />
    </div>
);

const INITIAL_STATE = {
    username: "",
    email: "",
    passwordOne: "",
    passwordTwo: "",
    error: null,
    result: null,
};

class SignUpForm extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    onSubmit = (event) => {
        const { username, email, passwordOne } = this.state;

        auth
            .doCreateUserWithEmailAndPassword(email, passwordOne)
            .then((authUser) => {
                authUser.updateProfile({ displayName: username });

                db
                    .doCreateUser(authUser.uid, username, email)
                    .then(() => {
                        this.setState({ result: "Conta criada com sucesso." });
                        event.preventDefault();
                    })
                    .catch((error) => {
                        this.setState({ error: error });
                    });
            })
            .catch((error) => {
                this.setState({ error: error });
            });

        event.preventDefault();
    };

    render() {
        const {
            username,
            email,
            passwordOne,
            passwordTwo,
            error,
            result,
        } = this.state;

        const isInvalid =
            passwordOne !== passwordTwo ||
            passwordOne === "" ||
            username === "" ||
            email === "";

        return (
            <div className="background-img">
                <div className="col-md-12">
                    <div className="container">
                        <div className="card-form card-form-container">
                            <img
                                width="35%"
                                className="img-responsive center-block"
                                src={logoImg}
                                alt="Best Choice"
                            />
                            {result && (
                                <div className="alert alert-success text-center">
                                    <b>Feito ! </b> {result}
                                </div>
                            )}
                            {error && (
                                <div className="alert alert-danger text-center">
                                    <b>Erro ! </b> {error.message}
                                </div>
                            )}
                            <form
                                className="form-signup"
                                onSubmit={this.onSubmit}>
                                <input
                                    className="form-control"
                                    value={username}
                                    onChange={(event) =>
                                        this.setState({
                                            username: event.target.value,
                                        })
                                    }
                                    type="text"
                                    id="inputUserName"
                                    placeholder="Nome Completo"
                                />
                                <input
                                    className="form-control"
                                    value={email}
                                    onChange={(event) =>
                                        this.setState({
                                            email: event.target.value,
                                        })
                                    }
                                    type="email"
                                    id="inputEmail"
                                    placeholder="E-mail"
                                />
                                <input
                                    className="form-control"
                                    value={passwordOne}
                                    onChange={(event) =>
                                        this.setState({
                                            passwordOne: event.target.value,
                                        })
                                    }
                                    type="password"
                                    id="inputPassword"
                                    placeholder="Senha"
                                />
                                <input
                                    className="form-control"
                                    value={passwordTwo}
                                    onChange={(event) =>
                                        this.setState({
                                            passwordTwo: event.target.value,
                                        })
                                    }
                                    type="password"
                                    id="inputPasswordConfirm"
                                    placeholder="Confirme a senha"
                                />
                                <button
                                    disabled={isInvalid}
                                    type="submit"
                                    className="btn btn-lg btn-warning btn-block btn-signup">
                                    Registrar
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const SignUpLink = () => (
    <p>
        Não tem uma conta ainda ? <Link to={routes.SIGN_UP}>Criar conta</Link>
    </p>
);

export default withRouter(SignUpPage);

export { SignUpForm, SignUpLink };
