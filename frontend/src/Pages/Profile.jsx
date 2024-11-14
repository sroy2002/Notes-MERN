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
    <div className="profile-container poppins-regular">
      <Navbar />
      <div className="profile-upper"></div>
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
      </div>
      <div className="title">
        <h1>My Profile</h1>
      </div>
      <form className="profile-form">
        <div className="naming">
          <div className="form-group">
            <label>First Name</label>
            <input type="text" placeholder="Enter First Name" />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input type="text" placeholder="Enter Last Name" />
          </div>
        </div>
        <div className="privacy">
          <div className="form-group">
            <label>Username</label>
            <input type="text" placeholder="Enter Username" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="text" placeholder="Enter Password" />
          </div>
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" placeholder="Enter Email" />
        </div>
        <div className="location">
          <div className="form-group">
            <label>City</label>
            <input type="text" placeholder="Enter City" />
          </div>
          <div className="form-group">
            <label>Country</label>
            <input type="text" placeholder="Enter Country" />
          </div>
        </div>
        <div className="btn">
          <button type="submit" className="btn-save">
            Save Changes
          </button>
          <button className="btn-cancel">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
