import React, { useState } from "react";
import { Grid, Paper, TextField, Button, Typography, Box } from "@mui/material";
import { styled } from "@mui/system";
import { useCookies } from "react-cookie";
import { fsdb } from "../config/firebase"; // Ensure this is your Firebase config
import { collection, query, where, getDocs, updateDoc, doc, arrayUnion } from "firebase/firestore"; // Import necessary Firestore functions

function SearchGroups() {
  const [groupID, setGroupID] = useState("");
  const [groupFound, setGroupFound] = useState(null);
  const [error, setError] = useState("");
  const [cookies] = useCookies(["user"]);

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

  // Handle Group Search
  const handleSearchGroup = async () => {
    setError("");
    setGroupFound(null);

    if (!groupID) {
      setError("Please enter a Group ID.");
      return;
    }

    try {
      // Create a query to search for the group by ID field
      const groupRef = collection(fsdb, "groups");
      const q = query(groupRef, where("id", "==", groupID));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Assuming the ID is unique, we take the first document from the query snapshot
        const groupDoc = querySnapshot.docs[0];
        setGroupFound({ id: groupDoc.id, ...groupDoc.data() });
      } else {
        setError("Group not found.");
      }
    } catch (err) {
      console.error("Error fetching group:", err);
      setError("Error searching for the group. Please try again.");
    }
  };

  // Handle Join Group
  const handleJoinGroup = async () => {
    if (!groupFound || !cookies.user?.email) return;

    try {
      const groupRef = doc(fsdb, "groups", groupFound.id);

      // Update group's email array with the user's email, only if not already added
      await updateDoc(groupRef, {
        members: arrayUnion(cookies.user.email),
      });

      alert("You have successfully joined the group!");
    } catch (err) {
      console.error("Error joining group:", err);
      alert("Failed to join the group. Please try again.");
    }
  };

  return (
    <Box padding={3}>
      <Grid container spacing={3}>
        {/* Left Grid: Group Search Section */}
        <Grid item xs={12} sm={4}>
          <Section>
            <Typography variant="h6" gutterBottom>
              Search Groups
            </Typography>
            <TextField
              autoFocus
              fullWidth
              variant="outlined"
              label="Group ID"
              value={groupID}
              onChange={(e) => setGroupID(e.target.value)}
            />
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              onClick={handleSearchGroup}
            >
              Search
            </Button>
            {error && (
              <Typography color="error" variant="body1" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
          </Section>
        </Grid>

        {/* Right Grid: Group Details Section */}
        <Grid item xs={12} sm={8}>
          <Section>
            <Typography variant="h6" gutterBottom>
              Group Details
            </Typography>
            {groupFound ? (
              <Box sx={{textAlign:'left'}}>
                <Typography variant="body1">
                  Group Name: {groupFound.name || "N/A"}
                </Typography>
                <Typography variant="body2">Group ID: {groupFound.id}</Typography>
                <Typography variant="body2">
                  Members: {groupFound.members?.length || 0}
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={handleJoinGroup}
                    disabled={
                      groupFound.members?.includes(cookies.user.email)
                    }
                  >
                    {groupFound.members?.includes(cookies.user.email)
                      ? "Already Joined"
                      : "Join Group"}
                  </Button>
                </Box>
              </Box>
            ) : (
              <Typography variant="body1">No group selected.</Typography>
            )}
          </Section>
        </Grid>
      </Grid>
    </Box>
  );
}

export default SearchGroups;
