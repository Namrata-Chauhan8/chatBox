import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import moment from "moment";
import ReceiveSound from "../assets/notification.mp3";

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const formattedDate = moment(message?.date?.toDate()).format("LLL");

  const ref = useRef();

  // Effect for scrolling into view
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  // Effect for playing sound on receiving a message
  useEffect(() => {
    if (message.senderId !== currentUser.uid) {
      const audio = new Audio(ReceiveSound);
      audio.play();
    }
  }, []);

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
        <span style={{ fontSize: "12px", color: "gray" }}>{formattedDate}</span>
      </div>
      <div className="messageContent">
        <p>{message.text}</p>
        {message.img && <img src={message.img} alt="" />}
      </div>
    </div>
  );
};

export default Message;
