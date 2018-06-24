import React, { Component } from "react";
import { db, auth } from "../../firebase";

import { Link } from "react-router-dom";

import * as routes from "../../constants/routes";
import logoImg from "../Images/logo.png";

class NavBar extends Component {
    constructor(props) {
        super(props);
        this.state = this.getInitialState();
    }

    getInitialState() {
        const initialState = {
            authUser: {},
            userName: "",
            userCoins: 0,
            totalAdventures: 20
        };

        return initialState;
    }

    componentDidMount() {
        db.refNode(`Users/${auth.getAuthUser().uid}`).on('value', (snapShot) => {
            let user = snapShot.val();
            this.setState({ authUser: user, userName: user.username, userCoins: user.coins });
        });
    }

    render() {
        const { userName } = this.state;

        return (
            <div>
            <nav className="navbar navbar-inverse navbar-fixed-top" role="navigation">
            <div className="container relative">
                <div className="navbar-header">
                    <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                        <span className="sr-only">Toggle navigation</span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                    </button>
                    <Link id="logo" className="navbar-brand" to={routes.DASHBOARD} >
                        <img width="75" src={logoImg}/>
                    </Link>
                </div>
                <div id="navbar">
                    <ul className="nav navbar-nav navbar-right">
                        <li><Link to={routes.STORE} >Loja</Link></li>
                        <li><Link to={routes.PROFILE} >Perfil</Link></li>
                        <li><Link to={routes.LOGOUT} >Sair</Link></li>
                    </ul>
                </div>
                <div className="coins">{this.state.userCoins} coins</div>
            </div>
        </nav>
        <div class="jumbotron">
        <div class="container">
            <div class="row">
                <div class="col-md-6">
                    <div id="profile">
                        <div id="complement-theme"></div>
                        <div class="row">
                            <div class="col-md-4">
                                <div id="image"></div>
                            </div>
                            <div id="info-profile" class="col-md-8">
                                <div id="name">{this.state.authUser.username}</div>
                                <div id="level">{this.state.authUser.levelString}</div>
                                <div id="info-level-progress">{this.state.authUser.adventuresDone}/{this.state.totalAdventures} aventuras realizadas</div>
                                <div id="level-progress">
                                    <div id="real-progress-level" class="_50" style={{width: `${(this.state.authUser.adventuresDone * 100)/this.state.totalAdventures}%`}}></div>
                                </div>
                                <div id="row-medals" class="row">
                                    <div class="col-md-12">
                                        <div class="col-md-2 medal _1"></div>
                                        <div class="col-md-2 medal _2"></div>
                                        <div class="col-md-2 medal _3"></div>
                                        <div class="col-md-2 medal _1"></div>
                                        <div class="col-md-2 medal _4"></div>
                                        <div class="col-md-2 medal _5"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div id="button-init-adventure">
                        <Link to={routes.ADVENTURE} >Começar uma aventura</Link>
                    </div>
                </div>
            </div>
        </div>
    </div>
        </div>
        );
    }
}

export default NavBar;

export { NavBar };
