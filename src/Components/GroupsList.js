import React, { useEffect, useState } from "react";
import { Paper, Typography, Button } from "@mui/material";
import { Box, styled } from "@mui/system";
import { fsdb } from "../config/firebase"; // Firestore database instance
import { collection, getDocs, query, where } from "firebase/firestore";
import { List, ListItem, ListItemText} from '@mui/material';
// Styled component
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

function GroupsList({ email, setgroupSelected }) {
  const [groups, setGroups] = useState([]);

  // Function to handle 'Chat' button click
  const handleMessage = (groupID, groupName) => {
    console.log(`Email: ${email}, Group: ${groupName} (ID: ${groupID})`);
    setgroupSelected(groupID); // Example function call to set the selected group
  };

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const groupsRef = collection(fsdb, "groups");
        const q = query(groupsRef, where("members", "array-contains", email)); // Query groups where the email is a member
        const querySnapshot = await getDocs(q);
        const fetchedGroups = [];

        querySnapshot.forEach((doc) => {
          fetchedGroups.push({ id: doc.id, ...doc.data() });
        });

        setGroups(fetchedGroups); // Set the groups in state
      } catch (err) {
        console.error("Error fetching groups:", err);
      }
    };

    fetchGroups();
  }, [email]); // Re-fetch groups whenever email changes

  return (
    <Section
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        flexShrink: 0,
      }}
    >
      <Box sx={{ padding: 2, wordWrap: "break-word" }}>
        <Typography variant="h5" gutterBottom>
          Group List
        </Typography>

        {/* Display the groups list */}
        {groups.length === 0 ? (
          <Typography>No groups found for this email.</Typography>
        ) : (<List>
            {groups.length > 0 ? (
              groups.map((group) => (
                <ListItem key={group.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {/* Display Group Name */}
                  <ListItemText primary={group.name} secondary={`ID: ${group.id}`} />
          
                  {/* Chat Button */}
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleMessage(group.id, group.name)}
                  >
                    Chat
                  </Button>
                </ListItem>
              ))
            ) : (
              <Typography>No groups to display.</Typography> // Display message if no groups found
            )}
          </List>
        )}
      </Box>
    </Section>
  );
}

export default GroupsList;
