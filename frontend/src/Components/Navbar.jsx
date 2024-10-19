import React, { useState } from "react";
import appicon from "../assets/note.png";
import Search from "./Search";
import { useAuth0 } from "@auth0/auth0-react";
import "../Styles/Navbar.scss";
import { IoSunnyOutline, IoMoonOutline } from "react-icons/io5";
import { FaBars } from "react-icons/fa6";
import { toast } from "react-toastify";

const Navbar = ({
  handlePanel,
  setNotes,
  fetchNotes,
  onSearchNote,
  fetchGuestNotes,
 
  setSearchError
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLight, setIsLight] = useState(true);
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();

  const handleLight = () => {
    setIsLight(!isLight);
  };

  const onClearSearch = () => {
    setSearchQuery("");

    if (isAuthenticated) {
      fetchNotes();
    } else {
      fetchGuestNotes();
    }
  };

  // search for guest users
  const searchGuestNotes = (query) => {
    const guestNotes = JSON.parse(sessionStorage.getItem("guestNotes")) || [];

    //filter notes based on the search query
    const filterNotes = guestNotes.filter((note) => {
      const searchLower = query.toLowerCase();
      const title = note.title ? note.title.toLowerCase() : "";
      const content = note.content ? note.content.toLowerCase() : "";
      const tags = note.tags ? note.tags : [];
      return (
        title.includes(searchLower) ||
        content.includes(searchLower) ||
        tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    });

    return filterNotes;
  };
  const handleSearch = async () => {
    setSearchError(false);
    if (isAuthenticated) {
      if (!searchQuery) {
        toast.error("Empty search is not allowed!");
        fetchNotes();
      } else {
        console.log("Searching for: ", searchQuery); // Log the search query
        await onSearchNote(searchQuery);
      }
    } else {
      if (!searchQuery) {
        toast.error("Empty search is not allowed!");
        fetchGuestNotes();
      } else {
        const filtered = searchGuestNotes(searchQuery);
        if(filtered.length==0){
          setSearchError(true);
        }
        else{
          setNotes(filtered);
          setSearchError(false);
        }
      }
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
