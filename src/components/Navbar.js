import React, { useContext } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../Firebase";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  const handleLogout = () => {
    signOut(auth);
    navigate("/login");
  };

  return (
    <div className="navbar">
      <span className="logo">Chat</span>
      <div className="user">
        <img src={currentUser?.photoURL} alt="" />
        <span>{currentUser?.displayName}</span>
        <button onClick={handleLogout}>logout</button>
      </div>
    </div>
  );
};

export default Navbar;
