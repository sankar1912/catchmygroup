import React, { useEffect, useState } from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Box,
  Paper,
  Button,
} from "@mui/material";
import { doc, onSnapshot } from "firebase/firestore"; // Use onSnapshot for real-time updates
import { fsdb } from "../config/firebase"; // Ensure correct Firebase Firestore config
import { styled } from "@mui/system";

function FriendsList({ email, setFriendSelected }) {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!email) return;

    setLoading(true);
    setError("");

    const docRef = doc(fsdb, "friends", email);

    // Real-time listener for friends list
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setFriends(docSnap.data().friendlist || []);
        } else {
          setFriends([]);
          setError("No friends found for this user.");
        }
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching friends:", err);
        setError("Failed to fetch friends.");
        setLoading(false);
      }
    );

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [email]);

  const Section = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(1),
    marginBottom: theme.spacing(2),
    borderRadius: "20px",
    backgroundColor: theme.palette.background.default,
    boxShadow: theme.shadows[5],
    width: "100%",
    boxSizing: "border-box",
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(2),
    },
  }));

  const handleMessage = (friendEmail) => {
    console.log("User Email:", email);
    console.log("Friend Email:", friendEmail);
    setFriendSelected(friendEmail);
  };

  return (
    <Section
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start", // Ensures content aligns properly
        flexShrink: 0, // Prevents section from shrinking
      }}
    >
      <Box sx={{ padding: 2, wordWrap: "break-word" }}>
        <Typography variant="h5" gutterBottom>
          Friends List
        </Typography>

        {loading ? (
          <CircularProgress /> // Show loading spinner
        ) : error ? (
          <Typography color="error">{error}</Typography> // Display error message
        ) : (
          <List>
            {friends.length > 0 ? (
              friends.map((friendEmail, index) => (
                <ListItem key={index}>
                  <ListItemText primary={friendEmail} />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleMessage(friendEmail)} // Handle chat message
                  >
                    Chat
                  </Button>
                </ListItem>
              ))
            ) : (
              <Typography>No friends to display.</Typography> // Display message if no friends found
            )}
          </List>
        )}
      </Box>
    </Section>
  );
}

export default FriendsList;
