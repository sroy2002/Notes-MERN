import React, { useState, useEffect, useRef } from "react";
import Navbar from "../Components/Navbar";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "../api";
import { HiPencil } from "react-icons/hi2";
import "../Styles/Profile.scss";

const Profile = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const { user, getAccessTokenSilently } = useAuth0();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    city: "",
    country: "",
    profileImage: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await axios.get(
          `http://localhost:8000/user/${user.sub}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFormData(response.data);
        
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };
    fetchUserData();
  }, [user, getAccessTokenSilently]);

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
        setFormData((prevData) => ({
          ...prevData,
          profileImage: reader.result,
        }));
      };
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    try {
      const token = await getAccessTokenSilently();
      const updatedData = {
        ...formData, // Existing form fields (firstName, lastName, etc.)
        profileImage: imageSrc || user.picture, // Use the new image or fallback to the existing one
      };
      await axios.put(`http://localhost:8000/user/${user.sub}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  return (
    <div className="profile-container poppins-regular">
      <Navbar />
      <div className="profile-upper"></div>
      <div className="profile-img">
        <div onClick={handleProfileClick} className="img">
          {imageSrc || formData.profileImage ? (
            <img src={imageSrc || formData.profileImage} alt="profile-image" />
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
      <form className="profile-form" onSubmit={handleSaveChanges}>
        <div className="naming">
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="Enter First Name"
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Enter Last Name"
            />
          </div>
        </div>
        <div className="privacy">
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Enter Username"
            />
          </div>
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter Email"
            readOnly
          />
        </div>
        <div className="location">
          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="Enter City"
            />
          </div>
          <div className="form-group">
            <label>Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              placeholder="Enter Country"
            />
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
