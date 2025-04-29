import React, { useState } from "react";
import { collection, query, where, getDocs, setDoc, updateDoc, doc, getDoc } from "firebase/firestore";
import { TextField, Button, Box, Typography, Grid, Paper } from "@mui/material";
import { styled } from "@mui/system";
import { useCookies } from "react-cookie";
import { fsdb } from "../config/firebase";
import { useNotifications } from "@toolpad/core";

function SearchFriends() {
  const [searchEmail, setSearchEmail] = useState("");
  const [userFound, setUserFound] = useState(null);
  const [error, setError] = useState("");
  const [cookies,setCookies,removeCookies] = useCookies(["user"]);
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

  const handleSearch = async () => {
    if (!searchEmail) {
      setUserFound(null);
      setError("");
      return;
    }

    setError("");
    try {
      const userQuery = query(collection(fsdb, "users"), where("email", "==", searchEmail));
      const querySnapshot = await getDocs(userQuery);

      if (querySnapshot.empty) {
        setError("User not found");
        setUserFound(null);
        notifications.show("User not found",{
          severity:'error',
          autoHideDuration:3000
        })
        return;
      }

      const userDoc = querySnapshot.docs[0];
      setUserFound(userDoc.data());
      console.log(userDoc.data());
    } catch (err) {
      setError("Error fetching user data.");
      console.error(err);
    }
  };
  const handleAddFriend = async () => {
    try {
      const invitationsRef = doc(fsdb, "invitations", userFound.email);
      const invitationsDoc = await getDoc(invitationsRef);

      if (invitationsDoc.exists()) {
        // Update existing document
        await updateDoc(invitationsRef, {
          invitations: [...(invitationsDoc.data().invitations || []), cookies.user.email],
        });
      } else {
        // Create new document
        await setDoc(invitationsRef, {
          invitations: [userFound.email],
        });
      }
      notifications.show("Friend request sent successfully",{
        severity:'success',
        autoHideDuration:5000
      })

    } catch (err) {
      console.error("Error sending friend request:", err);
      notifications.show("Failed to send friend request. Please try again.",{
        severity:'error',
        autoHideDuration:3000
      })
    }
  };

  return (
    <Box padding={3}>
      <Grid container spacing={4}>
        {/* Left Grid: Search Section */}
        <Grid item xs={12} sm={4} md={4}>
          <Section sx={{ overflow: "hidden", textAlign: "left" }}>
            <Typography variant="h6" gutterBottom>
              Search Friends
            </Typography>
            <div style={{ display: "flex", alignItems: "center" }}>
              <TextField
                autoFocus
                style={{ width: "80%" }}
                variant="outlined"
                label="Email"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
              />
              <Button onClick={handleSearch} variant="contained" sx={{ ml: 2 }}>
                Search
              </Button>
            </div>
          </Section>
        </Grid>

        {/* Right Grid: Search Result Section */}
        <Grid item xs={12} sm={8}>
          <Section sx={{ overflow: "hidden", textAlign: "left" }}>
            <Typography variant="h6" gutterBottom>
              Search Result
            </Typography>
            {error && (
              <Typography color="error" variant="body1">
                {error}
              </Typography>
            )}
            {userFound && (
              <Box>
                <Section>
                  <Typography variant="body1">User Found: {userFound?.name}</Typography>
                  <Typography variant="body2">Email: {userFound?.email}</Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      mt: 2,
                    }}
                  >
                    <Button
                      variant="outlined"
                      onClick={handleAddFriend}
                      disabled={userFound.email === cookies.user.email}
                    >
                      {userFound.email === cookies.user.email ? "You!!" : "Add Friend"}
                    </Button>
                  </Box>
                </Section>
              </Box>
            )}
          </Section>
        </Grid>
      </Grid>
    </Box>
  );
}

export default SearchFriends;
