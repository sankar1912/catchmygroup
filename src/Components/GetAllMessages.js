import React, { useEffect, useState } from "react";
import { fsdb } from "../config/firebase"; // Ensure Firebase config is correct
import { collection, doc, getDocs } from "firebase/firestore";

function GetAllMessages({ receiver }) {
  const [allMessages, setAllMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAllEmailsAndMessages = async () => {
      setLoading(true);
      setError("");
      try {
        
        const receiverDocRef = doc(fsdb, "messages", receiver); // Reference the receiver document
        console.log('Works here')
        const emailCollectionsSnapshot = await getDocs(collection(receiverDocRef)); // Get email subcollections

        const messages = [];

        // Iterate through all email subcollections
        for (const emailDoc of emailCollectionsSnapshot.docs) {
          const email = emailDoc.id; // Subcollection name (email)
          const emailMessagesRef = collection(receiverDocRef, email); // Reference the subcollection
          const emailMessagesSnapshot = await getDocs(emailMessagesRef); // Fetch all documents under this subcollection

          emailMessagesSnapshot.forEach((messageDoc) => {
            messages.push({
              email, // Include the email this message belongs to
              id: messageDoc.id, // Random ID of the message
              ...messageDoc.data(), // All fields of the message
            });
          });
        }

        setAllMessages(messages); // Set all messages in state
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError("Failed to fetch messages.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllEmailsAndMessages();
  }, [receiver]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h3>All Messages</h3>
      {allMessages.map((msg, index) => (
        <div key={index} style={{ marginBottom: "1em", padding: "1em", border: "1px solid #ccc" }}>
          <p><strong>Email:</strong> {msg.email}</p>
          <p><strong>Message ID:</strong> {msg.id}</p>
          <p><strong>Fields:</strong> {JSON.stringify(msg, null, 2)}</p>
        </div>
      ))}
    </div>
  );
}

export default GetAllMessages;
