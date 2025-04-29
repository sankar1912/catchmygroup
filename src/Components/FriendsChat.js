import React, { useState, useEffect } from "react";
import { Box, Grid, Paper } from "@mui/material";
import { styled } from "@mui/system";
import { useCookies } from "react-cookie";
import SearchFriends from "./SearchFriends";
import FriendsList from "./FriendsList";
import GetChats from "./GetChats";

function FriendsChat({navigate}) {
  const [friendSelected, setFriendSelected] = useState("");
  const [cookies] = useCookies(["user"]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    if (cookies.user)    {
      setLoading(false); // Cookies are loaded, stop loading
    }
    else
    {
        alert('Cookies unavailable');
        window.location.reload();
    }
  }, [cookies.user]); // Runs whenever cookies.user changes

  // If cookies are still loading or user is not available, show loading message
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <div>Loading...</div>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh", // Full viewport height
        padding: 3,
      }}
    >
      <SearchFriends />
      <Grid
        container
        sx={{
          flexGrow: 1,
            
        }}
        spacing={2}
      >
        <Grid
          item
          xs={12}
          sm={4}
          sx={{
         
            display: "flex",
            flexDirection: "column",
          }}
        >
          <FriendsList
            email={cookies.user?.email || ""}
            setFriendSelected={setFriendSelected}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={8}
          sx={{
         
            display: "flex",
            flexDirection: "column",
          }}
        >
          {friendSelected ? (
            <Section
              sx={{
                flexGrow: 1,
              }}
            >
              Friend: {friendSelected}
              <GetChats sender={cookies.user?.email || ""} reciever={friendSelected} />
            </Section>
          ) : (
            <Section
              sx={{
                flexGrow: 1,
                textAlign: "center",
              }}
            >
              Select a friend from List/Search your friend
            </Section>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

export default FriendsChat;
