import { doc, onSnapshot } from "firebase/firestore";
import React from "react";
import { useCookies } from "react-cookie";
import { fsdb } from "../config/firebase";

export default function GetInvitations() {
  const [cookies, setCookies, removeCookies] = useCookies(['user']);
  const [badgeContent, setBadgeContent] = React.useState(0);

  React.useEffect(() => {
    if (!cookies.user?.email) return;

    const docRef = doc(fsdb, 'invitations', cookies.user.email); // Firestore document reference

    // Set up a Firestore real-time listener
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const invitationCount = Array.isArray(data.invitations) ? data.invitations.length : 0;
          setBadgeContent(invitationCount); // Update badge content in real time
        } else {
          console.error('No such document in Firestore!');
          setBadgeContent(0); // Reset count if the document doesn't exist
        }
      },
      (error) => {
        console.error('Error listening to invitations:', error);
      }
    );

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, [cookies.user?.email]);

  return badgeContent;
}
