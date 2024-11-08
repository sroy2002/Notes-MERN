import React, { useState, useRef } from "react";
import Navbar from "../Components/Navbar";
import { useAuth0 } from "@auth0/auth0-react";
import { HiPencil } from "react-icons/hi2";
import "../Styles/Profile.scss";
const Profile = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const { user } = useAuth0();
  const fileInputRef = useRef(null);

  const handleProfileClick = () => {
    fileInputRef.current.click();
  };

  const onFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setImageSrc(reader.result);
        setShowCropModal(true);
      };
    }
  };
  return (
    <div>
      <Navbar />
      <div className="profile-upper"></div>
      <form>
        <div className="profile-img">
          <div onClick={handleProfileClick} className="img">
            {imageSrc ? (
              <img src={imageSrc} alt="profile-image" />
            ) : (
              <img src={user.picture} />
            )}
            <div className="overlay">
              <HiPencil />
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onFileChange}
            style={{ display: "none" }}
          />
          <h1>User Profile</h1>
        </div>
        <div className="profile-form">
          <label>First Name: </label>
          <input type="text" />
          <label>Last Name: </label>
          <input type="text" />
          <label>Username: </label>
          <input type="text" />
          <label>Email Id: </label>
          <input type="email" />
          <label>Country: </label>
          <input type="text" />
        </div>
        <button type="submit">Save</button>
        <button>Cancel</button>
      </form>
    </div>
  );
};

export default Profile;
