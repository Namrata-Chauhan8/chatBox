import React, { useContext, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import {
  Timestamp,
  arrayUnion,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../Firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { v4 as uuid } from "uuid";
import EmojiPicker from "emoji-picker-react";
import { GrEmoji } from "react-icons/gr";
import toast from "react-hot-toast";
import messageSound from "../assets/notification.mp3";

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImage] = useState(null);
  const [open, setOpen] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  const handleSend = async () => {
    try {
      let imageUrl = null;

      if (img) {
        const storageRef = ref(storage, uuid());
        const uploadTask = uploadBytesResumable(storageRef, img);

        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            null,
            (error) => {
              reject(error);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                imageUrl = downloadURL;
                resolve();
              });
            }
          );
        });
      }

      const messageData = {
        id: uuid(),
        text,
        senderId: currentUser.uid,
        date: Timestamp.now(),
      };

      if (imageUrl) {
        messageData.img = imageUrl;
      }
      setText("");
      setImage(null);
      // const sound = new Audio(messageSound);
      // sound.play();
      if (data.chatId.slice(0, 7) !== data.user.uid.slice(0, 7)) {
        const sound = new Audio(messageSound);
        sound.play();
      }
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion(messageData),
      });

      await updateDoc(doc(db, "userChats", currentUser.uid), {
        [`${data.chatId}.lastMessage`]: { text },
        [`${data.chatId}.date`]: serverTimestamp(),
      });

      await updateDoc(doc(db, "userChats", data.user.uid), {
        [`${data.chatId}.lastMessage`]: { text },
        [`${data.chatId}.date`]: serverTimestamp(),
      });
    } catch (error) {
      toast.error("Error sending message: ", error);
    }
  };

  return (
    <div className="input">
      <input
        type="text"
        placeholder="Type something..."
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <div className="send">
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <div className="emoji">
          <GrEmoji className="icon" onClick={() => setOpen((prev) => !prev)} />
          {open && (
            <div className="picker">
              <EmojiPicker onEmojiClick={handleEmoji} />
            </div>
          )}
        </div>
        <label htmlFor="file">
          <GrAttachment className="icon" />
        </label>
        <button
          onClick={handleSend}
          className="buttonsend"
          disabled={!text && !img}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Input;
