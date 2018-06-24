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
            offersHTML: [],
            totalAdventures: 20,
            userTheme: 'default'
        };

        return initialState;
    }

  

    componentDidMount(){
      db.refNode(`Users/${auth.getAuthUser().uid}`).on('value', (snapShot) => {
        if (snapShot.val() != null){
            this.setState({ authUser: snapShot.val(), userTheme: snapShot.val().theme }, () => {
                this.getOffers();
            });
        }
    });
    }

    getOffers(){
      db.refNode("Offers").on("value", offers => {
        if(offers.val()){
          
          var offersList = offers.val();

          var offersHTML = _.map(offersList, (offer, offerkey) => {
            return(
                <div class="col-md-3" key={offerkey}>
                    <div class={`box-offer-${this.state.userTheme}`}>
                        <h2>{offer.title}</h2>
                        <img src={offerImg} />
                        <p>{offer.desc}</p>
                        <button class="btn btn-primary">Comprar</button>
                    </div>
                </div>
            );
          });
          this.setState({offers: offersList, offersHTML});
        }
      })
    }

    render() {
        let offerIndex = 0;
        return(
          <div style={{paddingTop: 50}}>
            <NavBar />
    <div id="hot-offers" class="container">
    <h1 class={`title-section-${this.state.userTheme}`}>Principais ofertas</h1>
        <div className="row">
            { _.size(this.state.offersHTML) > 0 &&
            
            _.chunk(this.state.offersHTML, 4).map((group) => {
                return(
                    <div>
                        <div className="row">{group}</div>
                    {
                        _.last(this.state.offersHTML).key !== _.last(group).key && 
                        <hr className={`hr-${this.state.userTheme}`}/> 
                    }
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
