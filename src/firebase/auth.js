import { auth, registerAuth } from "./firebase";

// Sign Up
export const doCreateUserWithEmailAndPassword = (email, password) =>
    registerAuth.createUserWithEmailAndPassword(email, password);

export const logoutAfterCreated = () => registerAuth.signOut();

// Sign In
export const doSignInWithEmailAndPassword = (email, password) =>
    auth.signInWithEmailAndPassword(email, password);

// Sign out
export const doSignOut = () => auth.signOut();

// Password Reset
export const doPasswordReset = (email) => auth.sendPasswordResetEmail(email);

// Password Change
export const doPasswordUpdate = (password) =>
    auth.currentUser.updatePassword(password);

// Get Auth User
export const getAuthUser = () => auth.currentUser;

// Boolean to check if user is logged
export const userLogged = () => auth.currentUser !== null;
