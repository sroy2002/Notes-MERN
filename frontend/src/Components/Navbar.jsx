import React, { useState } from "react";
import appicon from "../assets/note.png";
import Search from "./Search";
import { useAuth0 } from "@auth0/auth0-react";
import "../Styles/Navbar.scss";
import { IoSunnyOutline, IoMoonOutline } from "react-icons/io5";
import { FaBars } from "react-icons/fa6";
import { toast } from "react-toastify";

const Navbar = ({ handlePanel, fetchNotes, onSearchNote, fetchGuestNotes }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLight, setIsLight] = useState(true);
  const { 
    loginWithRedirect, 
    logout, 
    isAuthenticated, 
    user 
  } = useAuth0();

  const handleLight = () => {
    setIsLight(!isLight);
  };

  const onClearSearch = () => {
    setSearchQuery("");
    
    if(isAuthenticated) {
      fetchNotes();
    }
    else{
      fetchGuestNotes();
    }
  };

  const handleSearch = async () => {
    if(!isAuthenticated){
      toast.error("You must be logged in to search.");
      return;
    }
    if (searchQuery) {
      console.log("Searching for: ", searchQuery); // Log the search query
      await onSearchNote(searchQuery);
    }
  };

  return (
    <div className="parent poppins-regular">
      <div className="branding">
        <FaBars className="menu-icon" onClick={handlePanel} />
        <img src={appicon} alt="app-icon" className="app-icon" />
        <p className="poppins-semibold brand-name">Note.It</p>
      </div>
      {/* <div className="list">
        <p></p>
      </div> */}
      <Search
        value={searchQuery}
        onChange={({ target }) => {
          setSearchQuery(target.value);
        }}
        onClearSearch={onClearSearch}
        handleSearch={handleSearch}
      />
      <div className="user">
        <div
          className={`mode ${isLight ? "" : "rotate"}`}
          onClick={handleLight}
        >
          {isLight ? <IoMoonOutline /> : <IoSunnyOutline />}
        </div>
        {isAuthenticated && (
          <div className="user-pic">
            <img src={user.picture} alt={user.name} />
          </div>
        )}
        {isAuthenticated ? (
          <button
            className="poppins-medium"
            onClick={() =>
              logout({ logoutParams: { returnTo: window.location.origin } })
            }
          >
            Log Out
          </button>
        ) : (
          <button
            className="poppins-medium"
            onClick={() => loginWithRedirect()}
          >
            Log In
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
