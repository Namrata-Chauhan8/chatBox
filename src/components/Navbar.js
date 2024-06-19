import React, { useContext } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../Firebase";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { IoMdLogOut } from "react-icons/io";
import { Tooltip } from "react-tooltip";

const Navbar = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  const handleLogout = () => {
    signOut(auth);
    navigate("/login");
  };

  return (
    <div className="navbar">
      <span className="logo">CHATBOX</span>
      <div className="user">
        <img src={currentUser?.photoURL} alt="" />
        <span className="username">{currentUser?.displayName}</span>
        <Tooltip id="Logout" />
        <IoMdLogOut
          onClick={handleLogout}
          className="logout"
          data-tooltip-id="Logout"
          data-tooltip-content="Logout"
        />
      </div>
    </div>
  );
};

export default Navbar;
