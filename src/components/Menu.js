// Menu.js
import React from "react";
import { FaUser, FaTrashAlt } from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";

const Menu = ({ onProfileClick, onDeleteAccountClick, onLogoutClick }) => {
  return (
    <div className="menu">
      <div className="menu-item" onClick={onProfileClick}>
        <FaUser /> Profile
      </div>
      <div className="menu-item" onClick={onDeleteAccountClick}>
        <FaTrashAlt /> Delete Account
      </div>
      <div className="menu-item" onClick={onLogoutClick}>
        <IoMdLogOut /> Logout
      </div>
    </div>
  );
};

export default Menu;
