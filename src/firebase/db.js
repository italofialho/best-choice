import { db } from "./firebase";

export const doCreateUser = (id, username, email) => {
    let nowEpoch = new Date();
    return db.ref(`Users/${id}/`).set({
        username: username,
        email: email,
        uid: id,
        createdDateEpoch: nowEpoch.getTime(),
        coins: 0,
        level: 0,
        levelString: 'unranked',
        adventuresDone: 0,
        theme: 'default'
    });
};

export const onceGetUsers = (userId) =>
    db.ref(`Users/${userId}`).once("value");

export const getAllUsers = () =>
    db.ref('Users');

export const refNode = (nodeRef) => db.ref(nodeRef);
