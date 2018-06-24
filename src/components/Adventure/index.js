import React, { Component } from 'react';
import { NavBar } from "../NavBar";
import withAuthorization from "../Session/withAuthorization";
import { db, auth } from '../../firebase';

import { Link } from "react-router-dom";
import * as routes from "../../constants/routes";

import _ from 'underscore';

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
  
 
  componentDidMount(){
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

  getAuthUser(){
    db.refNode(`Users/${auth.getAuthUser().uid}`).on('value', (snapShot) => {
      if (snapShot.val() != null) {
          this.setState({
              authUser: snapShot.val(),
              userTheme: snapShot.val().theme
          });
      }
  });
  }

  getAdventures(){
    db.refNode("Adventures/").on("value", adventures => {
      if(adventures.val()){
        var _adventures = adventures.val();
        var adventuresHTML = _.map(_adventures, (adventure, adventureKey) => {
          return(
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
                          <div class="bar-level-adventure-real" style={{width: '0%'}}></div>
                        </div>
                        <p>0% completo</p>
                    </div>
                </div>
            </div>
          )
        });
        this.setState({
          adventures: _adventures,
          adventuresHTML
        })
      }
    });
  }


  render() {
    return (
        <div style={{paddingTop: 50}}>
          <NavBar />
          
          <div id={`box-adventures-${this.state.userTheme}`} class="container">
            
          { _.size(this.state.adventuresHTML) > 0 &&
            
            _.chunk(this.state.adventuresHTML, 4).map((group) => {
              return(
                <div>
                    <div className="row">{group}</div>
                {
                    _.last(this.state.adventuresHTML).key !== _.last(group).key && 
                    <hr className={`hr-${this.state.userTheme}`}/> 
                }
                </div>
            )
            })
          }
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
