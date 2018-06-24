import React, { Component } from "react";
import withAuthorization from "../Session/withAuthorization";

import { NavBar } from "../NavBar";

import _ from "underscore";

import * as routes from "../../constants/routes";
import { Link } from "react-router-dom";

import { auth, db } from "../../firebase";

import offerImg from '../Images/offer.png'

class DashboardPage extends Component {
    constructor(props) {
        super(props);
        this.state = this.getInitialState();
    }

    getInitialState() {
        const initialState = {
            authUser: {},
            offers: {}
        };

        return initialState;
    }

  

    componentDidMount(){
      this.getOffers();
      db.refNode(`Users/${auth.getAuthUser().uid}`).on('value', (snapShot) => {
        if (snapShot.val() != null){
          this.setState({ authUser: snapShot.val() });
        }
    });
    }

    getOffers(){
      db.refNode("Offers").once("value").then(offers => {
        if(offers.val()){
          this.setState({offers: offers.val()});
          console.log("getOffers:", offers.val());
        }
      })
    }

    render() {
        return(
          <div>
            <NavBar />
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
                                <div id="name">Nícolas Paiva</div>
                                <div id="level">GOLD 1</div>
                                <div id="info-level-progress">17/20 aventuras realizadas</div>
                                <div id="level-progress">
                                    <div id="real-progress-level" class="_50"></div>
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
                        <a href="aventuras.html">Começar uma aventura</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div id="hot-offers" class="container">
        <h1 class="title-section">Principais ofertas</h1>
        <div class="row">
            { _.size(this.state.offers) > 0 &&
              _.map(this.state.offers, offer => {
                return(
                  <div class="col-md-3">
                <div class="box-offer">
                    <h2>Estilo</h2>
                    <img src={offerImg} />
                    <p>Hud skin de inverno, a nova moda.</p>
                </div>
            </div>
                )
              })
            }
            
        </div>
        <footer>
            <p>&copy; Best Choice 2018</p>
        </footer>
    </div>
            </div>
        );
    }
}

const DashboardPageLink = () => (
    <Link className="menu-link" to={routes.DASHBOARD}>
        <i className="fas fa-tachometer-alt" />
        <span>Dashboard</span>
    </Link>
);

const authCondition = (authUser) => !!authUser;
export default withAuthorization(authCondition)(DashboardPage);

export { DashboardPageLink };
