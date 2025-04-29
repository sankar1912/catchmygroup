import React, { useState } from "react";
import {
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Box,
} from "@mui/material";
import { Send, AttachFile, Close } from "@mui/icons-material";
import { fsdb } from "../config/firebase"; // Ensure correct Firebase Firestore config
import { collection, doc, addDoc, serverTimestamp } from "firebase/firestore";

function MessageInput({ sender, reciever }) {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");

  // Handle file selection and convert it to base64
  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const base64File = await convertFileToBase64(selectedFile);
      setFile(base64File);
      setFileName(selectedFile.name);
    }
  };

  // Convert file to base64 string
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Handle sending a message
  const handleSendMessage = async () => {
    if (message.trim() === "" && !file) return; // Prevent sending empty messages

    try {
      const recieverDocRef = doc(fsdb, "messages", reciever);
      const senderMessagesRef = collection(recieverDocRef, sender);

      // Prepare message data
      const messageData = {
        sender: sender,
        message: message.trim(),
        status: "unread",
        timestamp: serverTimestamp(),
      };

      if (file) {
        messageData.file = file;
        messageData.fileName = fileName;
        setFile(null);
        setFileName("");
      }

      // Add the message to Firestore
      await addDoc(senderMessagesRef, messageData);

      setMessage(""); // Clear the message input
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  // Clear the selected file
  const handleClearFile = () => {
    setFile(null);
    setFileName("");
  };

  // Handle "Enter" key press to send message
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {/* Input field with file attachment */}
      <TextField
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        fullWidth
        variant="outlined"
        onKeyDown={handleKeyDown}
        label="Say Hi..."
        InputProps={{
          startAdornment: fileName && (
            <InputAdornment position="start">
              <Tooltip title="Attached File">
                <Box display="flex" alignItems="center" gap={1}>
                  {fileName.endsWith(".jpg") || fileName.endsWith(".png") ? (
                    <img
                      src={file}
                      alt={fileName}
                      style={{ width: 40, height: 40, borderRadius: 4 }}
                    />
                  ) : (
                    <AttachFile color="primary" />
                  )}
                  <span style={{ fontSize: 12 }}>{fileName}</span>
                  <IconButton size="small" onClick={handleClearFile}>
                    <Close fontSize="small" />
                  </IconButton>
                </Box>
              </Tooltip>
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <Tooltip title="Attach File">
                <IconButton component="label">
                  <AttachFile />
                  <input
                    type="file"
                    accept="image/*,video/*,application/pdf"
                    hidden
                    onChange={handleFileChange}
                  />
                </IconButton>
              </Tooltip>
              <Button
                onClick={handleSendMessage}
                variant="contained"
                color="primary"
                size="small"
                disabled={message.trim() === "" && !file}
              >
                <Send />
              </Button>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
}

export default MessageInput;
