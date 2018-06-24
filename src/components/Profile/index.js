import React, { Component } from "react";
import withAuthorization from "../Session/withAuthorization";

import { NavBar } from "../NavBar";

import _ from "underscore";
import { Notify } from "../Common/Functions";

import { auth, db } from "../../firebase";
import { ToastContainer } from "react-toastify";

const images = require.context('../Images', true);


class ProfilePage extends Component {
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
            profileAvatar: 'homem-1',
            newProfile: {},
            purshasedItems: {}
        };

        return initialState;
    }

  

    componentDidMount() {
        this.getAuthUser();
    }

    getAuthUser() {
        db.refNode(`Users/${auth.getAuthUser().uid}`).on('value', (snapShot) => {
            if (snapShot.val() != null) {
                this.getPurchasedThemes();
                this.setState({
                    authUser: snapShot.val(),
                    newProfile: {
                        username: snapShot.val().username,
                        theme: snapShot.val().theme,
                        genre: snapShot.val().genre
                    },
                    userTheme: snapShot.val().theme,
                    profileAvatar: snapShot.val().profileAvatar
                });
            }
        });
    }

    getPurchasedThemes(){
        db.refNode(`Purchases/${auth.getAuthUser().uid}`)
            .orderByChild('itemType')
            .equalTo('theme')
            .once('value')
            .then((purshasedItems) => {
                if(purshasedItems.val()){
                    console.log("purshasedItems:", purshasedItems.val());
                    this.setState({purshasedItems: purshasedItems.val()})
                }
            });
    }

    updateProfileAvatar(avatar) {
        db.refNode(`Users/${auth.getAuthUser().uid}/profileAvatar`)
            .set(avatar)
            .then(() => {
                Notify(
                    "Avatar alterado com sucesso!",
                    "success"
                );
            }).catch(() => {
                Notify(
                    "Não foi possivel alterar o avatar!",
                    "error"
                );
            })
    }

    handleProfileChange(value, key) {
        this.setState(
            prevState => ({
                newProfile: {
                    ...prevState.newProfile,
                    [key]: value
                }
            })
        );
    }

    updateProfile(){
        const {
            newProfile
        } = this.state;
        db.refNode(`Users/${auth.getAuthUser().uid}`)
            .update(newProfile)
            .then(() => {
                Notify(
                    "Informações alteradas com sucesso!",
                    "success"
                );
            }).catch(() => {
                Notify(
                    "Não foi possivel atualizar as informações!",
                    "error"
                );
            });
    }


    render() {
        let offerIndex = 0;
        return(
          <div style={{paddingTop: 50}}>
            <NavBar />
            <ToastContainer />
            <div id={`perfil-info-${this.state.userTheme}`} className="container">
            <h1 className="title-section">Alterar dados pessoais</h1>
            <div className="row">
                <div className="col-md-6">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Nome</label>
                                <input 
                                onChange={e => this.handleProfileChange(e.target.value, "username")}
                                value={this.state.newProfile.username} 
                                type="text" 
                                className="form-control"/>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Sexo</label>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="radio-inline">
                                            <label>
                                                <input 
                                                type="radio" 
                                                onChange={() => this.handleProfileChange("MAN", "genre")}
                                                checked={this.state.newProfile.genre === "MAN"}/> 
                                                Masculino
                                                </label>
                                        </div>
                                        <div className="radio-inline">
                                            <label>
                                                <input 
                                                onChange={() => this.handleProfileChange("WOMAN", "genre")}
                                                checked={this.state.newProfile.genre === "WOMAN"}
                                                type="radio"/> 
                                                Feminino
                                                </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>E-mail</label>
                                <input value={this.state.authUser.email} type="text" className="form-control" disabled={true}/>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Tema</label>
                                <select 
                                    onChange={e => this.handleProfileChange(e.target.value, "theme")}
                                    className="form-control"
                                    value={this.state.newProfile.theme}>
                                    <option value="default">Padrão</option>
                                    {
                                        _.size(this.state.purshasedItems) > 0 &&
                                        _.map(this.state.purshasedItems, purshasedItem => {
                                            return(<option value={purshasedItem.itemKey}>{purshasedItem.itemName}</option>)
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <button onClick={() => this.updateProfile()} className="btn btn-success btn-full">Salvar</button>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div id="box-select-avatar">
                        <div className="row">
                            <div className="col-md-4">
                                <img className={this.state.profileAvatar === "homem-1" ? "current" : ""} src={images(`./homem-1.png`)} onClick={() => this.updateProfileAvatar("homem-1")}/>
                                <img className={this.state.profileAvatar === "homem-2" ? "current" : ""} src={images(`./homem-2.png`)} onClick={() => this.updateProfileAvatar("homem-2")}/>
                            </div>
                            <div id="avatar-payed" className="col-md-4">
                                <img className={this.state.profileAvatar === "homem-3" ? "current" : ""} src={images(`./homem-3.png`)} onClick={() => this.updateProfileAvatar("homem-3")}/>
                                <img className={this.state.profileAvatar === "mulher-3" ? "current" : ""} src={images(`./mulher-3.png`)} onClick={() => this.updateProfileAvatar("mulher-3")}/>
                            </div>
                            <div className="col-md-4">
                                <img className={this.state.profileAvatar === "mulher-1" ? "current" : ""} src={images(`./mulher-1.png`)} onClick={() => this.updateProfileAvatar("mulher-1")}/>
                                <img className={this.state.profileAvatar === "mulher-2" ? "current" : ""} src={images(`./mulher-2.png`)} onClick={() => this.updateProfileAvatar("mulher-2")}/>                                    
                            </div>
                        </div>
                    </div>                        
                </div>
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
export default withAuthorization(authCondition)(ProfilePage);
