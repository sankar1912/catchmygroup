import { Grid, Paper, Typography, Button } from "@mui/material";
import { Box, styled } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { collection, doc, getDoc, getDocs, query, where, updateDoc, arrayRemove, deleteDoc, onSnapshot } from "firebase/firestore";
import { fsdb } from "../config/firebase";
import { Email } from "@mui/icons-material";

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

function Home() {
  const [cookies] = useCookies(["user"]);
  const [userData, setUserData] = useState(null);
  const [userSince, setUserSince] = useState("");
  const [groups, setGroups] = useState([]);
  const [createdGroups, setCreatedGroups] = useState([]); 
  const [friendsList, setFriendsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      const userDocRef = doc(fsdb, "users", cookies.user.email);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData(data);

        if (data.createdAt) {
          const createdAtDate = new Date(data.createdAt.seconds * 1000);
          setUserSince(createdAtDate.toLocaleDateString());
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchGroups = async () => {
    try {
      const groupsCollection = collection(fsdb, "groups");
      const groupsSnapshot = await getDocs(groupsCollection);

      const userGroups = [];
      const createdGroups = []; 

      groupsSnapshot.forEach((doc) => {
        const groupData = doc.data();
        if (groupData.members && groupData.members.includes(cookies.user.email)) {
          userGroups.push({ id: doc.id, ...groupData });
        }
        if (groupData.createdBy === cookies.user.email) {
          createdGroups.push({ id: doc.id, ...groupData }); 
        }
      });

      setGroups(userGroups);
      setCreatedGroups(createdGroups); 
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  const fetchFriendsList = () => {
    const friendsDocRef = doc(fsdb, "friends", cookies.user.email);
  
    // Establish a real-time listener
    const unsubscribe = onSnapshot(
      friendsDocRef,
      (friendsDoc) => {
        if (friendsDoc.exists()) {
          const data = friendsDoc.data();
          setFriendsList(data.friendlist || []);
        } else {
          console.log("No friends list found for this user.");
          setFriendsList([]); // Handle empty friends list
        }
      },
      (error) => {
        console.error("Error fetching friends list:", error);
      }
    );
  
    // Return unsubscribe function for cleanup
    return unsubscribe;
  };

  const handleLeaveGroup = async (groupId) => {
    try {
      const groupDocRef = doc(fsdb, "groups", groupId);
      await updateDoc(groupDocRef, {
        members: arrayRemove(cookies.user.email),
      });
      fetchGroups(); 
    } catch (error) {
      console.error("Error leaving group:", error);
    }
  };

  const handleDeleteGroup = async (groupId) => {
    try {
      
      const groupDocRef = doc(fsdb, "groups", groupId);
      await deleteDoc(groupDocRef);
      
      
      fetchGroups();
    } catch (error) {
      console.error("Error deleting group:", error);
    }
  };

  const handleDisconnectFriend = async (friendEmail) => {
    try {
      const otherFriendDocRef=doc(fsdb,"friends",friendEmail);
      const friendsDocRef = doc(fsdb, "friends", cookies.user.email);
      await updateDoc(friendsDocRef, {
        friendlist: arrayRemove(friendEmail),
      });
      await updateDoc(otherFriendDocRef,{
        friendlist: arrayRemove(cookies.user.email),
      })
      fetchFriendsList(); 
    } catch (error) {
      console.error("Error disconnecting friend:", error);
    }
  };

  useEffect(() => {
    if (cookies.user && cookies.user.email) {
      setLoading(true);
      Promise.all([fetchUserData(), fetchGroups(), fetchFriendsList()]).then(() => {
        setLoading(false);
      });
    }
  }, [cookies.user]);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box padding={3} sx={{ wordWrap: "break-word"}}>
      <Grid container spacing={3}>
        {/* User Info Section */}
        <Grid item xs={12} sm={8}>
          <Section>
            <Typography variant="h6">User Information</Typography>
            {userData && (
              <Box textAlign={"left"}>
                <Typography>Name: {userData.name || "N/A"}</Typography>
                <Typography>Email: {cookies.user.email}</Typography>
              </Box>
            )}
          </Section>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Section>
            <Typography variant="h6">Account created</Typography>
            <Typography>{userSince}</Typography>
          </Section>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Groups Section */}
        <Grid item xs={12} sm={6}>
          <Section>
            <Typography variant="h6">Groups</Typography><br />
            {groups.length > 0 ? (
              groups.map((group) => (
                <Box key={group.id} display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Box display="flex" alignItems="center">
                    <Email sx={{ marginRight: 1 }} />
                    <strong>{group.id}</strong>
                  </Box>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => handleLeaveGroup(group.id)}
                  >
                    Disconnect
                  </Button>
                </Box>
              ))
            ) : (
              <Typography>No groups found</Typography>
            )}
          </Section>
        </Grid>

        {/* Group Leader Section */}
        <Grid item xs={12} sm={6} sx={{ wordWrap: "break-word"}}>
          <Section>
            <Typography variant="h6">Managed Groups</Typography><br />
            {createdGroups.length > 0 ? (
              createdGroups.map((group) => (
                <Box key={group.id} display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Box display="flex" alignItems="center">
                    <Email sx={{ marginRight: 1 }} />
                    <strong>{group.id}</strong>
                  </Box>
                  <Box>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => handleLeaveGroup(group.id)}
                      style={{ marginRight: '8px' }}
                    >
                      Leave
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => handleDeleteGroup(group.id)}
                    >
                      Delete
                    </Button>
                  </Box>
                </Box>
              ))
            ) : (
              <Typography>No groups found</Typography>
            )}
          </Section>
        </Grid>

       
<Grid item xs={12} sm={6} sx={{ wordWrap: "break-word" }}>
  <Section sx={{ wordWrap: "break-word" }}>
    <Typography variant="h6">Friends</Typography><br />
    {friendsList.length > 0 ? (
      friendsList.map((friend, index) => (
        <Box
          key={index}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
          sx={{ wordWrap: "break-word", overflow: "hidden", textOverflow: "ellipsis" }}
        >
          <Box
            display="flex"
            alignItems="center"
            sx={{ wordBreak: "break-word", maxWidth: "70%" }}
          >
            <Email sx={{ marginRight: 1 }} />
            <strong
              style={{
                whiteSpace: "nowrap", 
                overflow: "hidden",  
                textOverflow: "ellipsis", 
              }}
            >
              {friend}
            </strong>
          </Box>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => handleDisconnectFriend(friend)}
          >
            Disconnect
          </Button>
        </Box>
      ))
    ) : (
      <Typography>No friends found</Typography>
    )}
  </Section>
</Grid>

      </Grid>
    </Box>
  );
}

export default Home;
