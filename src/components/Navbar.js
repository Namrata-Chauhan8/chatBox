// import React, { useContext } from "react";
// import { signOut } from "firebase/auth";
// import { auth } from "../Firebase";
// import { AuthContext } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";
// import { IoMdLogOut } from "react-icons/io";
// import { Tooltip } from "react-tooltip";
// import toast from "react-hot-toast";
// import { FaUser } from "react-icons/fa";

// const Navbar = () => {
//   const navigate = useNavigate();
//   const { currentUser } = useContext(AuthContext);

//   const handleLogout = () => {
//     signOut(auth);
//     toast.success("Logout successfully");
//     navigate("/login");
//   };

//   return (
//     <div className="navbar">
//       <span className="logo">
//         <img
//           src="../chat.png"
//           alt=""
//           style={{ width: "18px", height: "18px" }}
//         />{" "}
//         CHATBOX
//       </span>
//       <div className="user">
//         <img src={currentUser?.photoURL} alt="" />
//         <span className="username">{currentUser?.displayName}</span>
//         <Tooltip id="Logout" />
//         <IoMdLogOut
//           onClick={handleLogout}
//           className="logout"
//           data-tooltip-id="Logout"
//           data-tooltip-content="Logout"
//         />
//         <Tooltip id="userIcon" />
//         <FaUser
//           className="userIcon"
//           data-tooltip-id="userIcon"
//           data-tooltip-content="Profile"/>
//       </div>
//     </div>
//   );
// };

// export default Navbar;
import React, { useContext, useState } from "react";
import { signOut, deleteUser, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { getFirestore, doc, deleteDoc } from "firebase/firestore";
import { auth } from "../Firebase";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { IoMdLogOut } from "react-icons/io";
import { Tooltip } from "react-tooltip";
import toast from "react-hot-toast";
import { FaUser } from "react-icons/fa";
import ProfileModal from "./ProfileModal";
import { CiMenuKebab } from "react-icons/ci";
import Menu from "./Menu";

const Navbar = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    signOut(auth);
    toast.success("Logout successfully");
    navigate("/login");
  };

  const handleDeleteAccount = async () => {
    const password = prompt("Please enter your password to confirm deletion:");
    if (!password) {
      toast.error("Password is required for account deletion");
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(auth.currentUser.email, password);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await deleteUser(auth.currentUser);

      // Delete user document from Firestore
      const db = getFirestore();
      const userDoc = doc(db, "users", auth.currentUser.uid);
      await deleteDoc(userDoc);

      toast.success("Account deleted successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Failed to delete account. Please re-authenticate and try again.");
    }
  };

  const openProfileModal = () => {
    setIsProfileModalOpen(true);
  };

  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <div className="navbar">
      <span className="logo">
        <img
          src="../chat.png"
          alt=""
          style={{ width: "18px", height: "18px" }}
        />{" "}
        CHATBOX
      </span>
      <div className="user">
        <img src={currentUser?.photoURL} alt="" />
        <span className="username">{currentUser?.displayName}</span>
        <CiMenuKebab onClick={toggleMenu} />
        {isMenuOpen && (
          <Menu
            onProfileClick={openProfileModal}
            onDeleteAccountClick={handleDeleteAccount}
            onLogoutClick={handleLogout}
          />
        )}
      </div>
      {isProfileModalOpen && (
        <ProfileModal currentUser={currentUser} onClose={closeProfileModal} />
      )}
    </div>
  );
};

export default Navbar;
