import admin from "firebase-admin";
import { getApps, initializeApp, getApp } from "firebase-admin/app";

function getAdminDb() {
    if (!getApps().length) {
        try {
            initializeApp();
        } catch (e) {
            console.error("Firebase admin initialization error:", e);
        }
    }
    return admin.firestore();
}

function getAdminAuth() {
    if (!getApps().length) {
        try {
            initializeApp();
        } catch (e) {
            console.error("Firebase admin initialization error:", e);
        }
    }
    return admin.auth();
}

export { getAdminDb, getAdminAuth };
