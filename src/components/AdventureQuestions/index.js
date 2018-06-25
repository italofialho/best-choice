import React, { Component } from 'react';
import { NavBar } from "../NavBar";
import withAuthorization from "../Session/withAuthorization";
import { db, auth } from '../../firebase';

import _ from 'underscore';
import $ from 'jquery';
import { Notify } from '../Common/Functions';
import { ToastContainer } from 'react-toastify';

import { Link } from "react-router-dom";

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
      dataFetched: false,
      selectedIndex: 1
    }
  }


  componentDidMount() {
    const { match: { params } } = this.props;
    this.getAuthUser();
    this.getAdventureById(params.adventureId);
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

  getAdventureById(adventureId) {
    this.setState({
      adventureId,
    });
    db.refNode(`AdventureQuestions/${adventureId}`).once("value").then(answerSnapshot => {
      if (answerSnapshot.val()) {
        this.setState({
          adventures: answerSnapshot.val(),
          adventuresCount: answerSnapshot.numChildren(),
          dataFetched: true
        }, () => {
          this.selectQuestion(1);
        })
      }
    });

    // db.refNode(`AdventureQuestions/${adventureId}`).push({
    //   adventureId,
    //   questionId: adventureId,
    //   question: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.",
    //   correctOption: "002",
    //   coins: 10,
    //   options: [
    //     {
    //       text: "Lorem ipsum dolor sit amet",
    //       value: "001"
    //     },
    //     {
    //       text: "Lorem ipsum dolor sit amet",
    //       value: "002"
    //     },
    //     {
    //       text: "Lorem ipsum dolor sit amet",
    //       value: "003"
    //     },
    //     {
    //       text: "Lorem ipsum dolor sit amet",
    //       value: "004"
    //     }
    //   ]
    // }).then(snap => {
    //   db.refNode(`AdventureQuestions/${adventureId}/${snap.key}/questionId`).set(snap.key);
    // })
  }

  shuffle(array) {
    return new Promise(resolve => {
      var currentIndex = array.length, temporaryValue, randomIndex;
      while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }
      resolve(array);
    });
  }

  selectQuestion(questionIndex) {
    var adventures = this.state.adventures;
    var adventureIndex = 0;
    var selectedAdventure = {};

    if (_.size(adventures) < questionIndex) {
      //TODO: Redirecionar para a index!
      return;
    }

    _.each(adventures, adventure => {
      adventureIndex++;
      if (adventureIndex === questionIndex) {
        selectedAdventure = adventure;
      }
    });

    this.shuffle(_.values(selectedAdventure.options)).then(optionsSuffle => {
      console.log("shuffle 1", optionsSuffle, selectedAdventure.options);
      selectedAdventure.options = optionsSuffle;
      console.log("shuffle 2", optionsSuffle, selectedAdventure.options);
    })

    this.setState({ selectedIndex: questionIndex, adventure: selectedAdventure }, () => {
      this.showAnswers();
    });

  }

  showAnswers() {
    var count = 100;
    $('.answer-question').each(function () {
      var this_ = $(this);
      count += 200;
      setTimeout(function () {
        this_.fadeIn('slow');
      }, count);
    });
  }

  updateAdventureState() {
    const { adventureId, adventures } = this.state;
    db.refNode(`Users/${auth.getAuthUser().uid}/adventures/${adventureId}`).update(adventures);
  }

  checkAnswer(userOption) {

    if (this.state.adventure.wasAnswered) {
      Notify(`Você já respondeu essa pergunta!`, "info");
      return;
    }

    if (userOption === this.state.adventure.correctOption) {
      let adventureOption = _.map(this.state.adventure.options, (option) => {
        if (this.state.adventure.correctOption === option.value) {
          option.correct = true;
        }
        return option;
      });

      console.log("adventureOption:", adventureOption);

      let updatedState = {
        ...this.state.adventure,
        correct: true,
        wasAnswered: true,
        options: adventureOption
      };

      let adventures = this.state.adventures;
      adventures[this.state.adventure.questionId] = updatedState;

      this.setState({ adventures }, () => {
        console.log("adventures:", this.state.adventures);
        this.goToNext();
        this.updateAdventureState();
      });

      this.addCoinsToUser().then(() => {
        Notify(`Reposta certa! Você recebeu +${this.state.adventure.coins} coins!!!`, "success");
      });
    } else {
      Notify(`Reposta errada!!!`, "warn");
      let updatedState = {
        ...this.state.adventure,
        correct: false,
        wasAnswered: true
      };

      let adventures = this.state.adventures;
      adventures[this.state.adventure.questionId] = updatedState;
      this.setState({ adventures }, () => {
        console.log("adventures:", this.state.adventures);
        this.goToNext();
        this.updateAdventureState();
      });
    }
  }

  addCoinsToUser() {
    var coins = this.state.adventure.coins;
    var userCoins = this.state.authUser.coins;
    return db.refNode(`Users/${auth.getAuthUser().uid}/coins`)
      .set(userCoins + coins);
  }

  leaveAdventure() {
    this.updateAdventureState();
  }

  removeOptions() {
    let count = 0;
    let adventureOption = _.map(this.state.adventure.options, (option) => {
      if (this.state.adventure.correctOption !== option.value && count < 2) {
        option.incorrect = true;
        count++;
      }

      return option;
    });

    this.setState(
      prevState => ({
        adventure: {
          ...prevState.adventure,
          options: adventureOption
        }
      }), () => {
        console.log("removeOptions:", this.state.adventure);
      }
    );
  }

  goToNext() {
    this.selectQuestion(this.state.selectedIndex + 1);
  }

  render() {
    return (
      <div className="bodyClass">
        <ToastContainer />
        <div id="background-image-home" style={{ backgroundImage: `url(${images(`./background-${this.state.userTheme}.jpg`)})` }}></div>
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
                return (
                  <div className={`answer-question ${option.incorrect ? "incorrect" : ""} ${option.correct ? "correct" : ""}`} onClick={() => this.checkAnswer(option.value)}>
                    <div>{option.text}</div>
                  </div>
                )
              })
            }
          </div>
          <div className="footer-question">
            <Link to="/adventure" className="more-time-question" onClick={() => this.leaveAdventure()}>
              <i className="fa fa-times"></i>
            </Link>
            <div className="help-question-question" title="Retirar 2 opções" onClick={() => this.removeOptions()}>
              <i className="fa fa-bomb"></i>
            </div>
            <a className="next-question" title="Próxima pergunta" onClick={() => this.goToNext()}>
              <i className="fa fa-chevron-circle-right"></i>
            </a>
          </div>
        </form>
      </div>
    )
  }
}

const authCondition = (authUser) => !!authUser;
export default withAuthorization(authCondition)(AdventureQuestions);
