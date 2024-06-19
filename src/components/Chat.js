import React, { useContext } from "react";
import { HiOutlineVideoCamera } from "react-icons/hi";
import { FaUser } from "react-icons/fa";
import { CiMenuKebab } from "react-icons/ci";
import Input from "./Input";
import Messages from "./Messages";
import { ChatContext } from "../context/ChatContext";

const Chat = () => {
  const { data } = useContext(ChatContext);

  return (
    <div className="chat">
      <div className="chatInfo">
        <span>{data.user?.displayName}</span>
        <div className="chatIcons">
          <FaUser />
          <HiOutlineVideoCamera />
          <CiMenuKebab />
        </div>
      </div>
      <Messages />
      {data.user?.displayName && <Input />}
    </div>
  );
};

export default Chat;
