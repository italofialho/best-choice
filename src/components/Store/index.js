import React, { Component } from "react";
import withAuthorization from "../Session/withAuthorization";

import { NavBar } from "../NavBar";

import _ from "underscore";

import * as routes from "../../constants/routes";
import { Link } from "react-router-dom";

import { auth, db } from "../../firebase";

import offerImg from '../Images/offer.png'

class StorePage extends Component {
    constructor(props) {
        super(props);
        this.state = this.getInitialState();
    }

    getInitialState() {
        const initialState = {
            authUser: {},
            offers: {},
            totalAdventures: 20
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
          <div style={{paddingTop: 50}}>
            <NavBar />
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
                    <button class="btn btn-primary">Comprar</button>
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



const authCondition = (authUser) => !!authUser;
export default withAuthorization(authCondition)(StorePage);
