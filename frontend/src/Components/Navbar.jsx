import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
  setSearchError,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLight, setIsLight] = useState(true);
  const [profileClicked, setProfileClicked] = useState(false);
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();
  // const navigate = useNavigate();

  const handleProfileClick = () => {
    setProfileClicked(true);
  };

  // Reset search bar visibility on route change
  // useEffect(() => {
  //   if (location.pathname === "/profile") {
  //     setProfileClicked(true);
  //   } else {
  //     setProfileClicked(false); // Show search bar on other pages
  //   }
  // }, [location.pathname]);

  const handleLight = () => {
    setIsLight(!isLight);
  };

  const onClearSearch = () => {
    setSearchQuery("");

    if (isAuthenticated) {
      fetchNotes();
      setSearchError(false);
    } else {
      fetchGuestNotes();
      setSearchError(false);
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
        setSearchError(false);
      } else {
        const result = await onSearchNote(searchQuery);
        if (!result || !Array.isArray(result) || result.length === 0) {
          setSearchError(true);
        } else {
          setSearchError(false);
        }
      }
    } else {
      if (!searchQuery) {
        toast.error("Empty search is not allowed!");
        fetchGuestNotes();
      } else {
        const res = searchGuestNotes(searchQuery);
        if (!res || !Array.isArray(res) || res.length === 0) {
          setSearchError(true);
        } else {
          setNotes(res);
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
      {!profileClicked && (
        <Search
          value={searchQuery}
          onChange={({ target }) => {
            setSearchQuery(target.value);
          }}
          onClearSearch={onClearSearch}
          handleSearch={handleSearch}
        />
      )}
      <div className="user">
        <div
          className={`mode ${isLight ? "" : "rotate"}`}
          onClick={handleLight}
        >
          {isLight ? <IoMoonOutline /> : <IoSunnyOutline />}
        </div>
        {isAuthenticated && (
          <div className="user-pic" onClick={handleProfileClick}>
            <img
              src={ user.picture}
              
              alt={user.name}
            />
          </div>
        )}
        {isAuthenticated ? (
          <motion.button
            whileHover={{
              scale: 1.1,
              boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.3)",
            }}
            whileTap={{ scale: 0.8 }}
            transition={{ duration: 0.01 }}
            className="poppins-medium"
            onClick={() =>
              logout({ logoutParams: { returnTo: window.location.origin } })
            }
          >
            Log Out
          </motion.button>
        ) : (
          <motion.button
            whileHover={{
              scale: 1.1,
              boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.3)",
            }}
            whileTap={{ scale: 0.8 }}
            transition={{ duration: 0.01 }}
            className="poppins-medium login-btn"
            onClick={() => loginWithRedirect()}
          >
            Log In
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
