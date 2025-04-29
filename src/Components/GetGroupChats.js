import React, { useEffect, useRef, useState } from "react";
import { fsdb } from "../config/firebase";
import { doc, collection, query, orderBy, onSnapshot, getDoc } from "firebase/firestore";
import { Box, Typography, Paper, Link } from "@mui/material";
import { styled } from "@mui/system";
import MessageInput from "./MessageInput";
import { AccessTime, AccountCircle, CloudDownload, MarkChatReadOutlined, MarkEmailRead } from "@mui/icons-material";

function GetGroupChats({ sender, reciever }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const messageContainerRef = useRef(null);
  const [userEmails, setUserEmails] = useState([]);

  useEffect(() => {
    const fetchGroupEmails = async () => {
      try {
        const groupDocRef = doc(fsdb, "groups", reciever);
        const groupDoc = await getDoc(groupDocRef);

        if (groupDoc.exists()) {
          const groupData = groupDoc.data();
          const emails = groupData.members || [];
          setUserEmails(emails);
        } else {
          console.log("No such group document!");
        }
      } catch (err) {
        console.error("Error fetching group emails:", err);
      }
    };

    fetchGroupEmails();
  }, [reciever]);

  useEffect(() => {
    const fetchMessages = () => {
      setLoading(true);
      setError("");

      const unsubscribeFunctions = userEmails.map((email) => {
        const senderDocRef = doc(fsdb, "messages", reciever);
        const senderMessagesRef = collection(senderDocRef, email);
        const senderMessagesQuery = query(senderMessagesRef, orderBy("timestamp"));

        return onSnapshot(
          senderMessagesQuery,
          (querySnapshot) => {
            const fetchedMessages = querySnapshot.docs.map((doc) => ({
              ...doc.data(),
              id: doc.id,
            }));

            setMessages((prevMessages) => {
              const mergedMessages = [...prevMessages, ...fetchedMessages];
              const uniqueMessages = Array.from(
                new Map(mergedMessages.map((msg) => [msg.id, msg])).values()
              );

              const sortedMessages = uniqueMessages.sort((a, b) => {
                const timeA = a.timestamp?.seconds
                  ? new Date(a.timestamp.seconds * 1000 + a.timestamp.nanoseconds / 1e6).getTime()
                  : 0;
                const timeB = b.timestamp?.seconds
                  ? new Date(b.timestamp.seconds * 1000 + b.timestamp.nanoseconds / 1e6).getTime()
                  : 0;
                return timeA - timeB;
              });

              return sortedMessages;
            });

            setLoading(false);
          },
          (error) => {
            console.error("Error fetching messages: ", error);
            setError("Failed to fetch messages. Please try again later.");
            setLoading(false);
          }
        );
      });

      return () => {
        unsubscribeFunctions.forEach((unsubscribe) => unsubscribe());
      };
    };

    if (userEmails.length > 0) {
      fetchMessages();
    }
  }, [userEmails, reciever]);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const MessageBubble = styled(Paper)(({ theme, isSender }) => ({
    padding: theme.spacing(1, 2),
    borderRadius: "15px",
    maxWidth: "60%",
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
          {messages.map((msg) => {
            const messageDate = msg.timestamp
              ? new Date(msg.timestamp.seconds * 1000 + msg.timestamp.nanoseconds / 1e6).toLocaleString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })
              : "Unknown Time";

            return (
              <Box key={msg.id} sx={{ display: "flex", flexDirection: "column" }}>
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
                      <span
                        style={{
                          textAlign: msg.sender === sender ? "right" : "left",
                          color: msg.sender === sender ? "white" : "black",
                        }}
                      >
                        <strong>{msg.message}</strong>
                      </span>
                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          marginTop: "1px",
                          color: msg.sender === sender ? "white" : "black",
                          textAlign: msg.sender === sender ? "right" : "left",
                        }}
                      >
                        <AccessTime
                          sx={{ 
                            paddingBlockStart: "10px",
                            position: "relative",
                            top: "2px",
                          }}
                        />  
                        {messageDate}
                        
                      </Typography>
                      <Typography variant="caption" sx={{
    color: msg.sender === sender ? "white" : "black",
    marginBottom: "2px",
    display: "flex",          // To align the icon and text in a row
    alignItems: "center",     // Vertically align the icon and text
       // Ensure the text wraps if it overflows
    maxWidth: "100%",          // Limit width to prevent overflow
    overflow: "hidden",       // Hide the overflow text
    textOverflow: "ellipsis",
    wordWrap: "break-word",
  }}>
                      <AccountCircle
                          sx={{
                            paddingBlockStart: "5px",
                          }}
                        />{msg.sender}
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

export default GetGroupChats;
