import {
  DocumentData,
  WithFieldValue,
  addDoc,
  collection,
} from "firebase/firestore";
import { Dispatch, SetStateAction } from "react";
import { db } from "./firebase";
import { FirebaseError } from "firebase/app";

const addUserDoc = async <T extends WithFieldValue<DocumentData>>(
  user: T,
  setAuthErrorMessage: Dispatch<SetStateAction<string>>
) => {
  try {
    await addDoc(collection(db, "users"), {
        displayName: user.displayName,
        accessToken: user.accessToken,
        email: user.email,
        providerId: user.providerId,
        uid: user.uid,
        phoneNumber: user.phoneNumber
    //   ...user,
    });
  } catch (error) {
    setAuthErrorMessage((error as FirebaseError)?.message);
  }
};

export default addUserDoc;
