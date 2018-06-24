import * as firebase from "firebase";

const normalConfig = {
    apiKey: "AIzaSyBBIoAyewDm5jm6k_21JXG5zvLnEK8H0Gs",
    authDomain: "best-choice-1a0c7.firebaseapp.com",
    databaseURL: "https://best-choice-1a0c7.firebaseio.com",
    projectId: "best-choice-1a0c7",
    storageBucket: "best-choice-1a0c7.appspot.com",
    messagingSenderId: "513158914257"
};

const registerConfig = {
    apiKey: "AIzaSyBBIoAyewDm5jm6k_21JXG5zvLnEK8H0Gs",
    authDomain: "best-choice-1a0c7.firebaseapp.com",
    databaseURL: "https://best-choice-1a0c7.firebaseio.com",
    projectId: "best-choice-1a0c7",
    storageBucket: "best-choice-1a0c7.appspot.com",
    messagingSenderId: "513158914257"
};

if (!firebase.apps.length) {
    firebase.initializeApp(normalConfig);
}

var secondaryApp = firebase.initializeApp(registerConfig, "Secondary");

const db = firebase.database();
const auth = firebase.auth();
const registerAuth = secondaryApp.auth();

export {
    db,
    auth,
    registerAuth
};
