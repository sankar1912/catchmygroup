import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { doc, onSnapshot, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { fsdb } from "../config/firebase"; // Firestore config
import { Typography, List, ListItem, ListItemText, Button, Box, Paper } from "@mui/material";
import { styled } from "@mui/system";
import { useNotifications } from "@toolpad/core";

function Invitations() {
  const [cookies] = useCookies(["user"]);
  const [invitations, setInvitations] = useState([]);
  const [error, setError] = useState("");
  const notifications=useNotifications();
  const Section = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
    borderRadius: "20px",
    backgroundColor: theme.palette.background.default,
    boxShadow: theme.shadows[5],
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(2),
    },
  }));

  // Set up Firestore real-time listener for invitations
  useEffect(() => {
    if (!cookies.user?.email) {
      setError("User not logged in");
      return;
    }

    const invitationsRef = doc(fsdb, "invitations", cookies.user.email);

    const unsubscribe = onSnapshot(
      invitationsRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setInvitations(data.invitations || []);
        } else {
          setInvitations([]);
        }
      },
      (err) => {
        console.error("Error listening to invitations:", err);
        setError("Failed to fetch invitations.");
      }
    );

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, [cookies.user?.email]);

  // Accept invitation
  const handleAccept = async (email) => {
    try {
      // Update friends for the current user
      const userFriendsRef = doc(fsdb, "friends", cookies.user.email);
      await updateDoc(userFriendsRef, {
        friendlist: arrayUnion(email),
      });

      // Update friends for the invited user
      const friendFriendsRef = doc(fsdb, "friends", email);
      await updateDoc(friendFriendsRef, {
        friendlist: arrayUnion(cookies.user.email),
      });

      // Remove invitation from the current user's invitations
      const invitationsRef = doc(fsdb, "invitations", cookies.user.email);
      await updateDoc(invitationsRef, {
        invitations: arrayRemove(email),
      });
      notifications.show("Invitation accepted",{
        severity:'success',
        autoHideDuration:3000
      })
      // Local state will auto-update due to `onSnapshot`
    } catch (err) {
      console.error("Error accepting invitation:", err);
      setError("Failed to accept invitation.");
    }
  };

  // Reject invitation
  const handleReject = async (email) => {
    try {
      // Remove invitation from the current user's invitations
      const invitationsRef = doc(fsdb, "invitations", cookies.user.email);
      await updateDoc(invitationsRef, {
        invitations: arrayRemove(email),
      });

      // Local state will auto-update due to `onSnapshot`
    } catch (err) {
      console.error("Error rejecting invitation:", err);
      setError("Failed to reject invitation.");
    }
  };

  return (
    <Box padding={3}>
      <Section>
        <Typography variant="h6" gutterBottom>
          Invitations
        </Typography>
        {error && (
          <Typography color="error" variant="body1">
            {error}
          </Typography>
        )}
        {invitations.length > 0 ? (
          <List>
            {invitations.map((email, index) => (
              <ListItem key={index} sx={{ display: "flex", justifyContent: "space-between" }}>
                <ListItemText primary={email} />
                <Box>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ marginRight: 1 }}
                    onClick={() => handleAccept(email)}
                  >
                    Accept
                  </Button>
                  <Button variant="outlined" color="error" onClick={() => handleReject(email)}>
                    Reject
                  </Button>
                </Box>
              </ListItem>
            ))}
          </List>
        ) : (
          !error && <Typography variant="body1">No invitations found.</Typography>
        )}
      </Section>
    </Box>
  );
}

export default Invitations;
