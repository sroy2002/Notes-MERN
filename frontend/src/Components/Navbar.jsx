import React, { useState, useEffect } from "react";

import { motion } from "framer-motion";
import appicon from "../assets/note.png";
import Search from "./Search";
import "../Styles/Navbar.scss";

import { FaBars } from "react-icons/fa6";
import { toast } from "react-toastify";
import NotFound from "./NotFound";

const Navbar = ({
  notes,
  handlePanel,
  setNotes,
  fetchNotes,
  onSearchNote,
  setSearchError,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const onClearSearch = () => {
    setSearchQuery("");

    fetchNotes();
    setSearchError(false);
  };

  const handleSearch = async () => {
    setSearchError(false);

    if (!searchQuery) {
      toast.error("Empty search is not allowed!");
      fetchNotes();
      setSearchError(false);
    } else {
      const result = await onSearchNote(searchQuery);
      console.log(result)
      if (!result || !Array.isArray(result) || result.length === 0) {
        setSearchError(true);
        setNotes([]);
      } else {
        setNotes(result);
        setSearchError(false);
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

      <Search
        value={searchQuery}
        onChange={({ target }) => {
          setSearchQuery(target.value);
        }}
        onClearSearch={onClearSearch}
        handleSearch={handleSearch}
      />

    </div>
  );
};

export default Navbar;
