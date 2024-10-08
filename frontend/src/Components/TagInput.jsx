import React, { useState } from "react";
import { IoMdAdd, IoMdClose } from "react-icons/io";
import "../Styles/TagInput.scss";
const TagInput = ({ tags, setTags }) => {
  const [inputValue, setInputValue] = useState("");
  const handleInput = (e) => {
    setInputValue(e.target.value);
  };
  const addNewTag = () => {
    if(tags.length>=3){
      alert("You can only add 3 tags!");
      return;
    }
    if (inputValue.trim() !== "") {
      setTags([...tags, inputValue.trim()]);
      setInputValue("");
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      addNewTag();
    }
  };
  const handleRemove = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };
  return (
    <div className="tag-parent">
      {tags?.length > 0 && (
        <div className="show-tag">
          {tags.map((tag, index) => {
            return (
              <span key={index}>
                <p className="tagNames"> # {tag}</p>
                <button className="close" onClick={() => handleRemove(tag)}>
                  <IoMdClose />
                </button>
              </span>
            );
          })}
        </div>
      )}
      <div className="input-tag">
        <input
          type="text"
          placeholder="Add tags"
          value={inputValue}
          onChange={handleInput}
          className="poppins-regular"
          onKeyDown={handleKeyDown}
        />
        <button
          className="tag-btn"
          onClick={() => {
            addNewTag();
          }}
        >
          <IoMdAdd />
        </button>
      </div>
    </div>
  );
};

export default TagInput;
