import React, { Component } from "react";
import { db, auth } from "../../firebase";

import logoImg from "../Images/logo.png";

class NavBar extends Component {
    constructor(props) {
        super(props);
        this.state = this.getInitialState();
    }

    getInitialState() {
        const initialState = {
            userName: "",
            userCoins: 0
        };

        return initialState;
    }

    componentDidMount() {
        db.refNode(`Users/${auth.getAuthUser().uid}`).on('value', (snapShot) => {
            let user = snapShot.val();
            this.setState({ userName: user.username, userCoins: user.coins });
        });
    }

    render() {
        const { userName } = this.state;

        return (
            <nav className="navbar navbar-inverse navbar-fixed-top" role="navigation">
            <div className="container relative">
                <div className="navbar-header">
                    <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                        <span className="sr-only">Toggle navigation</span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                    </button>
                    <a id="logo" className="navbar-brand" href="index.html">
                    <img width="75" src={logoImg}/>
                    </a>
                </div>
                <div id="navbar">
                    <ul className="nav navbar-nav navbar-right">
                        <li><a href="loja.html">Loja</a></li>
                        <li><a href="perfil.html">Perfil</a></li>
                        <li><a href="login.html">Sair</a></li>
                    </ul>
                </div>
                <div className="coins">{this.state.userCoins} coins</div>
            </div>
        </nav>
        );
    }
}

export default NavBar;

export { NavBar };
