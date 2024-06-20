import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { db } from "../Firebase";
import Message from "./Message";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);

  useEffect(() => {
    if (!data.chatId) {
      setMessages([]); // Clear messages if no chat is selected
      return;
    }

    const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      if (doc.exists()) {
        setMessages(doc.data().messages || []); // Handle the case where messages might be undefined
      } else {
        setMessages([]);
      }
    });

    return () => {
      unSub();
    };
  }, [data.chatId]);

  return (
    <div className="messages">
      {messages.length > 0 ? (
        messages.map((m) => <Message message={m} key={m.id} />)
      ) : (
        <p className="noMessages">Please select a chat to start Conversation</p>
      )}
    </div>
  );
};

export default Messages;
