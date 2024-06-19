import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import moment from "moment";

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const getFormattedDate = (date) => {
    const formattedDate = moment(date.toDate()).format('h:mm a');
    return formattedDate;
  };

  const [formattedDate, setFormattedDate] = useState(getFormattedDate(message.date));
  const [isJustNow, setIsJustNow] = useState(false);
  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });

    const interval = setInterval(() => {
      const { formattedDate, isJustNow } = updateMessageTime(message.date);
      setFormattedDate(formattedDate);
      setIsJustNow(isJustNow);
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [message]);

  

  const updateMessageTime = (date) => {
    const now = moment();
    const messageDate = moment(date.toDate());
    const diffMinutes = now.diff(messageDate, 'minutes');

    if (diffMinutes === 0) {
      return { formattedDate: "Just now", isJustNow: true };
    } else {
      return { formattedDate: getFormattedDate(date), isJustNow: false };
    }
  };

  return (
    <div
      ref={ref}
      className={`message ${message.senderId === currentUser.uid && "owner"}`}
    >
      <div className="messageInfo">
        <img
          src={
            message.senderId === currentUser.uid
              ? currentUser.photoURL
              : data.user.photoURL
          }
          alt=""
        />
        <span>{isJustNow ? "Just now" : formattedDate}</span>
      </div>
      <div className="messageContent">
        <p>{message.text}</p>
        {message.img && <img src={message.img} alt="" />}
      </div>
    </div>
  );
};

export default Message;
