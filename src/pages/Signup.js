// import React, { useState } from "react";
// import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
// import { auth, db, storage } from "../Firebase";
// import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
// import { doc, setDoc } from "firebase/firestore";
// import { useNavigate } from "react-router-dom";
// import { LuImagePlus } from "react-icons/lu";
// import toast from "react-hot-toast";

// const Signup = () => {
//   const navigate = useNavigate();
//   const [err, setErr] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const displayName = e.target[0].value;
//     const email = e.target[1].value;
//     const password = e.target[2].value;
//     const avatar = e.target[3].files[0];

//     try {
//       const res = await createUserWithEmailAndPassword(auth, email, password);

//       const storageRef = ref(storage, `${displayName}`);

//       const uploadTask = uploadBytesResumable(storageRef, avatar);

//       uploadTask.on(
//         (error) => {
//           // Error function
//           console.error("Upload failed:", error);
//           setErr(true);
//         },
//         async () => {
//           // Complete function
//           try {
//             const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
//             await updateProfile(res.user, {
//               displayName,
//               photoURL: downloadURL,
//             });
//             await setDoc(doc(db, "users", res.user.uid), {
//               uid: res.user.uid,
//               displayName,
//               email,
//               photoURL: downloadURL,
//             });

//             await setDoc(doc(db, "userChats", res.user.uid), {});
//           } catch (error) {
//             toast.error("Error updating profile or setting document:", error);
//             setErr(true);
//           }
//         }
//       );
//       toast.success("Account created successfully");
//       navigate("/login");
//     } catch (error) {
//       toast.error(error.message);
//       setErr(true);
//     }
//   };

//   return (
//     <div className="formContainer">
//       <div className="formWrapper">
//         <span className="logo"><img src="../chat.png" alt="" style={{width:"20px",height:"18px"}}/>ChatBox</span>
//         <span className="title">Register</span>
//         <form onSubmit={handleSubmit}>
//           <input type="text" placeholder="Username" />
//           <input type="email" placeholder="Email" />
//           <input type="password" placeholder="Password" />
//           <input type="file" id="file" style={{ display: "none" }} />
//           <label htmlFor="file">
//             <LuImagePlus className="img" />
//             <span>Add an avatar</span>
//           </label>
//           <button>Sign Up</button>
//           {err && <span>Something went wrong</span>}
//         </form>
//         <p>
//           Already have an account?{" "}
//           <span
//             style={{ cursor: "pointer" }}
//             onClick={() => navigate("/login")}
//           >
//             Login
//           </span>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Signup;
import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../Firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { LuImagePlus } from "react-icons/lu";
import toast from "react-hot-toast";

const Signup = () => {
  const navigate = useNavigate();
  const [err, setErr] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const avatar = selectedImage;

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const storageRef = ref(storage, `${displayName}`);

      const uploadTask = uploadBytesResumable(storageRef, avatar);

      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          // Error function
          console.error("Upload failed:", error);
          setErr(true);
        },
        async () => {
          // Complete function
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL,
            });
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
            });

            await setDoc(doc(db, "userChats", res.user.uid), {});
            toast.success("Account created successfully");
            navigate("/login");
          } catch (error) {
            toast.error("Error updating profile or setting document:", error);
            setErr(true);
          }
        }
      );
    } catch (error) {
      toast.error(error.message);
      setErr(true);
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">
          <img src="../chat.png" alt="" style={{ width: "20px", height: "18px" }} />
          ChatBox
        </span>
        <span className="title">Register</span>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Username" />
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <input type="file" id="file" style={{ display: "none" }} onChange={handleFileChange} />
          <label htmlFor="file">
            {imagePreview ? (
              <img src={imagePreview} alt="avatar" style={{ width: "40px", height: "40px", borderRadius: "50%" }} />
            ) : (
              <LuImagePlus className="img" />
            )}
            <span>{imagePreview ? "Change avatar" : "Add an avatar"}</span>
          </label>
          <button>Sign Up</button>
          {err && <span>Something went wrong</span>}
        </form>
        <p>
          Already have an account?{" "}
          <span
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
