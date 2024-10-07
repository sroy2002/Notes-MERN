import React from "react";
import "../Styles/Searchbar.scss";
import { BsSearch } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
const Search = ({ 
  value, 
  onChange,
  handleSearch, 
  onClearSearch }) => {
  return (
    <div className="container">
      <input
        type="text"
        placeholder="Search Notes"
        className="search poppins-regular"
        value={value}
        onChange={onChange}
      />
      <div>
        {value &&
          <RxCross2 className="search-icon" onClick={onClearSearch} /
        >}
        <BsSearch className="search-icon" onClick={handleSearch}/>
      </div>
    </div>
  );
};

export default Search;
