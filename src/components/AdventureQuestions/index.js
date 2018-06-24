import React, { Component } from 'react';
import { NavBar } from "../NavBar";
import withAuthorization from "../Session/withAuthorization";
import { db, auth } from '../../firebase';

import _ from 'underscore';
import $ from 'jquery';
import { Notify } from '../Common/Functions';
import { ToastContainer } from 'react-toastify';

const images = require.context('../Images', true);

class AdventureQuestions extends Component {

  constructor(props) {
    super(props)
  
    this.state = {
        authUser: {},
        userTheme: 'default',
        adventures: {},
        adventure: {},
        adventuresCount: 0,
        adventureId: null,
        dataFetched: false
    }
  }
  
 
  componentDidMount(){
    const { match: { params } } = this.props;
    this.getAuthUser();
    this.getAdventureById(params.adventureId);
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

  getAdventureById(adventureId){
    this.setState({
      adventureId,
    });
    db.refNode(`AdventureQuestions/${adventureId}`).once("value").then(answerSnapshot => {
      if(answerSnapshot.val()){
        this.setState({
          adventures: answerSnapshot.val(),
          adventuresCount: answerSnapshot.numChildren(),
          dataFetched: true
        }, () => {
          this.selectQuestion(1);
        })
      }
    });
    /*db.refNode(`AdventureQuestions/${adventureId}`).push({
      adventureId,
      questionId: adventureId,
      question: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.",
      correctOption: "002",
      coins: 10,
      options: [
        {
          text: "Lorem ipsum dolor sit amet",
          value: "001"
        },
        {
          text: "Lorem ipsum dolor sit amet",
          value: "002"
        },
        {
          text: "Lorem ipsum dolor sit amet",
          value: "003"
        },
        {
          text: "Lorem ipsum dolor sit amet",
          value: "004"
        }
      ]
    }).then(snap => {
      db.refNode(`AdventureQuestions/${adventureId}/${snap.key}/questionId`).set(snap.key);
    })*/
  }

  selectQuestion(questionIndex) {
    var adventures = this.state.adventures;
    var adventureIndex = 0;
    var selectedAdventure = {};

    _.each(adventures, adventure => {
      adventureIndex++;
      if (adventureIndex === questionIndex) {
        selectedAdventure = adventure;
      }
    });

    this.setState({ adventure: selectedAdventure }, () => {
      this.showAnswers();
      console.log("selectQuestion:", questionIndex, selectedAdventure);
    });

  }

  showAnswers(){
    var count = 100;
    $('.answer-question').each(function () {
      var this_ = $(this);
      count += 200;
      setTimeout(function () {
        this_.fadeIn('slow');
      }, count);
    });
  }

  checkAnswer(userOption){
    if(userOption === this.state.adventure.correctOption){
      this.addCoinsToUser().then(() => {
        Notify(`Reposta certa! Você recebeu +${this.state.adventure.coins} coins!!!`, "success");
      });
    }else{
      Notify(`Reposta errada!!!`, "warn");
    }
  }

  addCoinsToUser(){
    var coins = this.state.adventure.coins;
    var userCoins = this.state.authUser.coins;
    return db.refNode(`Users/${auth.getAuthUser().uid}/coins`)
      .set(userCoins + coins);
  }


  render() {
    return(
      <div className="bodyClass">
      <ToastContainer />
        <div id="background-image-home" style={{backgroundImage: `url(${images(`./background-${this.state.userTheme}.jpg`)})`}}></div>
        <form className="answer-form text-center" action="dashboard.php">
            <div class={`header-question-${this.state.userTheme}`}>
                <div className="title-category-question">{this.state.adventure.adventureTitle}</div>
            </div>
            <div className="question">
                <div className="box-question box-question-1"></div>
                <div className="box-question box-question-2"></div>
                <div className="box-question box-question-3"></div>
                <div className="box-question box-question-4"></div>
                <div className="box-question box-question-5"><div>{this.state.adventure.question}</div></div>
                <div className="box-type-answer"></div>
            </div>
            <div className="box-answer-question">
                {
                  this.state.adventure.options && 
                  _.map(this.state.adventure.options, option => {
                    return(
                      <div className="answer-question" onClick={() => this.checkAnswer(option.value)}>
                        <div>{option.text}</div>
                      </div>
                    )
                  })
                }
            </div>
            <div className="footer-question">
                <a href="aventuras-inverno.html" className="more-time-question" title="Sair do teste"><i className="fa fa-times"></i></a>
                <div className="help-question-question" title="Retirar 2 opções"><i className="fa fa-bomb"></i></div>
                <a href="aventura-inverno.html" className="try-again-question" title="Trocar pergunta"><i className="fa fa-redo"></i></a>
                <a href="aventura-inverno.html" className="next-question" title="Próxima pergunta"><i className="fa fa-chevron-circle-right"></i></a>
            </div>
        </form>
      </div>
    )
  }
}

const authCondition = (authUser) => !!authUser;
export default withAuthorization(authCondition)(AdventureQuestions);
