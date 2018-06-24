import React, { Component } from "react";
import withAuthorization from "../Session/withAuthorization";

import { NavBar } from "../NavBar";

import _ from "underscore";

import * as routes from "../../constants/routes";
import { Link } from "react-router-dom";

import { auth, db } from "../../firebase";

import { Notify } from "../Common/Functions";
import { ToastContainer } from "react-toastify";

const images = require.context('../Images', true);

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
            userTheme: 'default',
            buying: false
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
      db.refNode("Offers/").on("value", offers => {
        if(offers.val()){
          
          var offersList = offers.val();

          var offersHTML = _.map(offersList, (offer, offerkey) => {
            return(
                <div className="col-md-3" key={offerkey}>
                    <div class={`box-offer-${this.state.userTheme}`}>
                        <h2>{offer.title}</h2>
                        <img src={images(`./${offer.image}`)} />
                        <p>{offer.desc}</p>
                        <div class="box-coins-adventure">
                            <p class="total-coins">{offer.coins} COINS</p>
                        </div>
                        <button disabled={this.state.buying} className="btn btn-primary" onClick={() => this.buyItem(offer, offerkey)}>Comprar</button>
                    </div>
                </div>
            );
          });
          this.setState({offers: offersList, offersHTML});
        }
      })
    }

    buyItem(offer, offerKey) {
        this.setState({
            buying: true
        });

        var that = this;

        var userCoins = this.state.authUser.coins - offer.coins;
        db.refNode(`Purchases/${this.state.authUser.uid}/${offerKey}`)
            .once("value")
            .then((purchase) => {
                if (!purchase.val()) {
                    if (offer.coins <= this.state.authUser.coins) {
                        db.refNode(`Purchases/${this.state.authUser.uid}/${offerKey}`).set({
                            ...offer,
                            offerKey
                        }).then(() => {
                            db.refNode(`Users/${auth.getAuthUser().uid}/coins`).set(userCoins).then(() => {
                                that.setState({
                                    buying: false
                                });
                                Notify("Item comprado com sucesso!", "success");
                                that.getOffers();
                            }).catch(() => {
                                db.refNode(`Purchases/${this.state.authUser.uid}/${offerKey}`).remove().then(() => {
                                    Notify("Não foi possivel comprar o item!", "error");
                                });
                                that.setState({
                                    buying: false
                                });
                            });
                        }).catch(() => {
                            Notify("Erro ao adquirir item!", "error");
                            that.setState({
                                buying: false
                            });
                        });
                    } else {
                        Notify("Você não tem coins suficientes para comprar o item selecionado!", "info");
                        that.setState({
                            buying: false
                        });
                    }
                } else {
                    Notify("Você já comprou esse item!", "warn");
                    that.setState({
                        buying: false
                    });
                }
            });
    }

    render() {
        let offerIndex = 0;
        return(
          <div style={{paddingTop: 50}}>
            <NavBar />
            <ToastContainer />
    <div id="hot-offers" className="container">
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
