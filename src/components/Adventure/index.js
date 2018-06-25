import React, { Component } from 'react';
import { NavBar } from "../NavBar";
import withAuthorization from "../Session/withAuthorization";
import { db, auth } from '../../firebase';

import { Link } from "react-router-dom";
import * as routes from "../../constants/routes";

import _ from 'underscore';
import { CLIENT_RENEG_LIMIT } from 'tls';

class AdventurePage extends Component {

  constructor(props) {
    super(props)

    this.state = {
      adventures: {},
      adventuresHTML: {},
      authUser: {},
      userTheme: 'default',
    }
  }


  componentDidMount() {
    this.getAuthUser();
    this.getAdventures();
    /*db.refNode(`Adventures/`).push({
      title: "Conhecendo a plataforma",
      desc: "",
      coins: "100",
      coinsPerQuestion: "10",
      backgroundImage: "background-adventure-1.png",
      iconImage: "icon-adventure-1.png"
    }).then(snap => {
      db.refNode(`Adventures/${snap.key}/adventureId`).set(snap.key);
    })*/
  }

  getAuthUser() {
    db.refNode(`Users/${auth.getAuthUser().uid}`).on('value', (snapShot) => {
      if (snapShot.val() != null) {
        this.setState({
          authUser: snapShot.val(),
          userTheme: snapShot.val().theme
        });
      }
    });
  }

  getUserAdventureStatus(adventureId) {
    console.log("getUserAdventureStatus:", adventureId);
    
      let wasAnsweredCount = 0;
      db.refNode(`Users/${auth.getAuthUser().uid}/adventures/${adventureId}/`)
        .once("value")
        .then((adventureSnapShot) => {
          console.log("adventureSnapShot:", adventureSnapShot.val());
          let adventures = adventureSnapShot.val();
          if (adventures) {
            _.map(adventures, adventure => {
              if (adventure.wasAnswered) {
                wasAnsweredCount++;
              }
            });

            var _adventures = this.state.adventures;
            _adventures[adventureId].wasAnsweredCount = parseInt((wasAnsweredCount * 100) / adventureSnapShot.numChildren());
            this.setState({adventures: _adventures});
          } else {
            var _adventures = this.state.adventures;
            _adventures[adventureId].wasAnsweredCount = 0;
            this.setState({adventures: _adventures});
          }
        });
  }

  getAdventures() {
    db.refNode("Adventures/").once("value", adventures => {
      if (adventures.val()) {
        let _adventures = adventures.val();
        _.map(_adventures, (adventure, adventureKey) => {
          this.getUserAdventureStatus(adventureKey);
        });
        this.setState({adventures: _adventures})
      }
    });
  }


  render() {
    return (
      <div style={{ paddingTop: 50 }}>
        <NavBar />

        <div id={`box-adventures-${this.state.userTheme}`} class="container">
          <div className="row">
            {_.size(this.state.adventures) > 0 &&

              _.map(this.state.adventures, (adventure, adventureKey) => {
                //this.getUserAdventureStatus(adventureKey);
                  return (
                    <div class="col-md-3" key={adventureKey}>
                      <div class="adventure">
                        <div class="title-adventure">
                          {adventure.title}
                        </div>
                        <div class="img-adventure"></div>
                        <div class="icon-adventure"></div>
                        <div class="box-coins-adventure">
                          <p class="total-coins">{adventure.coins} COINS</p>
                          <p class="parcial-coins">{adventure.coinsPerQuestion} COINS (POR PERGUNTA)</p>
                        </div>
                        <div class="box-button">
                          <Link to={`${routes.ADVENTURE}/${adventure.adventureId}`}>Iniciar</Link>
                          <div class="bar-level-adventure">
                            <div class="bar-level-adventure-real" style={{ width: `${adventure.wasAnsweredCount ? adventure.wasAnsweredCount: 0}%` }}></div>
                          </div>
                          <p>{adventure.wasAnsweredCount ? adventure.wasAnsweredCount: 0}% completo</p>
                        </div>
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
    )
  }
}

const authCondition = (authUser) => !!authUser;
export default withAuthorization(authCondition)(AdventurePage);
