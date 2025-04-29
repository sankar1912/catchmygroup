import React, { useEffect, useRef, useState } from "react";
import { fsdb } from "../config/firebase";
import { doc, collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { Box, Typography, Paper, Link, Tooltip } from "@mui/material";
import { styled } from "@mui/system";
import MessageInput from "./MessageInput";
import { AccountCircle, CloudDownload } from "@mui/icons-material";

function GetChats({ sender, reciever }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const messageContainerRef = useRef(null);

  useEffect(() => {
    const fetchMessages = () => {
      setLoading(true);
      setError("");
      try {
        const senderDocRef = doc(fsdb, "messages", sender);
        const senderMessagesRef = collection(senderDocRef, reciever);
        const senderMessagesQuery = query(senderMessagesRef, orderBy("timestamp"));

        const unsubscribeSender = onSnapshot(senderMessagesQuery, (querySnapshot) => {
          const senderMessages = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            timestamp: doc.data().timestamp ? doc.data().timestamp.toDate() : null,
          }));

          const recieverDocRef = doc(fsdb, "messages", reciever);
          const recieverMessagesRef = collection(recieverDocRef, sender);
          const recieverMessagesQuery = query(recieverMessagesRef, orderBy("timestamp"));

          const unsubscribeReceiver = onSnapshot(recieverMessagesQuery, (querySnapshot) => {
            const recieverMessages = querySnapshot.docs.map((doc) => ({
              ...doc.data(),
              timestamp: doc.data().timestamp ? doc.data().timestamp.toDate() : null,
            }));

            const combinedMessages = [...senderMessages, ...recieverMessages].filter((msg) => msg.timestamp);
            combinedMessages.sort((a, b) => a.timestamp - b.timestamp);
            setMessages(combinedMessages);
          });

          return () => unsubscribeReceiver();
        });

        return () => unsubscribeSender();
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError("Failed to fetch messages.");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [sender, reciever]);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const MessageBubble = styled(Paper)(({ theme, isSender }) => ({
    padding: theme.spacing(1, 2),
    borderRadius: "15px",
    maxWidth: "100%",
    margin: theme.spacing(1),
    backgroundColor: isSender ? theme.palette.primary.main : theme.palette.grey[300],
    color: isSender ? "#fff" : "#000",
    alignSelf: isSender ? "flex-end" : "flex-start",
  }));

  return (
    <div>
      {loading ? (
        <Typography>Loading messages...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            marginTop: 2,
            overflowY: "auto",
            height: "400px",
          }}
          ref={messageContainerRef}
        >
          {messages.map((msg, index) => {
            const messageDate = msg.timestamp
              ? new Date(msg.timestamp).toLocaleString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })
              : "Unknown Time";

            return (
              <Box key={index} sx={{ display: "flex", flexDirection: "column" }}>
                <MessageBubble isSender={msg.sender === sender}>
                  {msg.file ? (
                    msg.file.startsWith("data:image/") ? (
                      <>
                        <img
                          src={msg.file}
                          alt={msg.fileName}
                          style={{ maxWidth: "100%", borderRadius: "10px" }}
                        />
                        <a href={msg.file} download>
                          <CloudDownload sx={{ color: "white" }} />
                        </a>
                      </>
                    ) : (
                      <Link
                        href={msg.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        download={msg.fileName}
                        underline="hover"
                        color="inherit"
                      >
                        {msg.fileName}
                      </Link>
                    )
                  ) : (
                    <>
                    <span style={{textAlign: msg.sender === sender ? "right" : "left",color: msg.sender === sender ? "white" : "black",textOverflow: "ellipsis",
    wordWrap: "break-word",}}>{msg.message}</span>
                    <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      marginTop: "1px",
                      color: msg.sender === sender ? "white" : "black",
                      textAlign: msg.sender === sender ? "right" : "left",
                    }}
                  >
                    {messageDate}{" "}
                    <AccountCircle
                      sx={{
                        paddingBlockStart: "10px",
                        position: "relative",
                        top: "2px",
                      }}
                    />
                  </Typography>
                    </>
                  )}
                </MessageBubble>
                
              </Box>
            );
          })}
        </Box>
      )}
      <MessageInput sender={sender} reciever={reciever} />
    </div>
  );
}

export default GetChats;
