// ProfileModal.js
import React, { useState } from "react";
import { updateProfile } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth } from "../Firebase";
import toast from "react-hot-toast";

const ProfileModal = ({ currentUser, onClose }) => {
  const [displayName, setDisplayName] = useState(currentUser.displayName || "");
  const [photoFile, setPhotoFile] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setPhotoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let photoURL = currentUser.photoURL;

    if (photoFile) {
      const storage = getStorage();
      const storageRef = ref(storage, `${currentUser.displayName}`);
      await uploadBytes(storageRef, photoFile);
      photoURL = await getDownloadURL(storageRef);
    }

    try {
      await updateProfile(auth.currentUser, {
        displayName,
        photoURL,
      });
      toast.success("Profile updated successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="profile-modal">
      <div className="profile-modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Update Profile</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Display Name:
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </label>
          <label>
            Profile Photo:
            <input type="file" onChange={handleFileChange} />
          </label>
          <button type="submit">Save</button>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;
