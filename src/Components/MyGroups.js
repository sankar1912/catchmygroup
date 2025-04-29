import React, { useState, useEffect } from "react";
import { Box, Grid, Paper } from "@mui/material";
import { styled } from "@mui/system";
import { useCookies } from "react-cookie";
import SearchFriends from "./SearchFriends";
import FriendsList from "./FriendsList";
import GetChats from "./GetChats";
import SearchGroups from "./SearchGroups";
import GroupsList from "./GroupsList";
import GetGroupChats from "./GetGroupChats";
import GetAllMessages from "./GetAllMessages";

function MyGroups({navigate}) {
  const [groupSelected, setgroupSelected] = useState("");
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
      <SearchGroups />
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
          <GroupsList
            email={cookies.user?.email || ""}
            setgroupSelected={setgroupSelected}
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
          {groupSelected ? (
            <Section
              sx={{
                flexGrow: 1,
              }}
            >
              Group: {groupSelected}
              <hr/>
              <GetGroupChats sender={cookies.user?.email || ""} reciever={groupSelected} />
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

export default MyGroups;
