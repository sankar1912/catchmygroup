import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { fsdb } from "../config/firebase"; // Firestore database instance
import { collection, getDoc, doc, setDoc } from "firebase/firestore";
import { TextField, Button, Typography, Box } from "@mui/material";

function GroupInvitations({ navigate }) {
  const [cookies] = useCookies(["user"]);
  const [groupName, setGroupName] = useState("");
  const [emails, setEmails] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleCreateGroup = async () => {
    if (!groupName.trim() || !emails.trim()) {
      setError("Group name and emails are required.");
      return;
    }

    const emailList = emails.split(",").map((email) => email.trim());
    const validMembers = [];
    const invalidEmails = [];

    try {
      // Check if the users exist in the system
      for (const email of emailList) {
        const userDocRef = doc(fsdb, "users", email);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          console.log(email)
          validMembers.push(email);
        } else {
          invalidEmails.push(email);
        }
        validMembers.push(cookies.user.email)
      }

      if (validMembers.length === 0) {
        setError("None of the provided emails exist in the system.");
        return;
      }

      // Generate a custom groupID (You can adjust the logic as per your requirement)
      const groupID = groupName.trim().toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();

      // Create the group document with groupID as the document ID
      const groupRef = doc(fsdb, "groups", groupID); // Using groupID as the document ID
      await setDoc(groupRef, {
        id:groupID,
        name: groupName,
        members: validMembers,
        createdBy: cookies.user.email,
      });

      setSuccessMessage(
        `Group "${groupName}" created successfully with members: ${validMembers.join(", ")}`
      );
      setError(""); // Reset error message

      // Reset the inputs
      setGroupName("");
      setEmails("");
    } catch (err) {
      console.error("Error creating group:", err);
      setError("Failed to create the group. Please try again later.");
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5">Create a Group</Typography>
      {error && <Typography color="error">{error}</Typography>}
      {successMessage && <Typography color="success.main">{successMessage}</Typography>}

      <TextField
        label="Group Name"
        variant="outlined"
        fullWidth
        margin="normal"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      />

      <TextField
        label="Emails (comma-separated)"
        variant="outlined"
        fullWidth
        margin="normal"
        value={emails}
        onChange={(e) => setEmails(e.target.value)}
        helperText="Enter the emails of users you want to add to the group, separated by commas."
      />

      <Button variant="contained" color="primary" onClick={handleCreateGroup}>
        Create Group
      </Button>
    </Box>
  );
}

export default GroupInvitations;
