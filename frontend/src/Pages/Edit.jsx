import React, { useState } from "react";
import "../Styles/Edit.scss";
import TagInput from "../Components/TagInput";
import { IoMdClose } from "react-icons/io";
const Edit = ({ noteData, type, onClose }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [error, setError] = useState(null);

  const addNewNote = async () => {};
  const editNote = async () => {};
  const handleAddNote = () => {
    if (!title) {
      setError("Please enter the title !");
      return;
    }
    if (!content) {
      setError("Please enter the content !");
      return;
    }

    setError("");
    if (type === "edit") {
      editNote();
    } else {
      addNewNote();
    }
  };
  return (
    <div className="modal-parent">
      <button className="close-modal" onClick={onClose}>
        <IoMdClose className="close-icon" />
      </button>
      <div className="upper part">
        <label className="label-box poppins-medium">TITLE</label>
        <input
          type="text"
          placeholder="Go to gym at 5pm"
          className="text-area title poppins-semibold"
          value={title}
          onChange={({ target }) => {
            setTitle(target.value);
          }}
        />
      </div>
      <div className="body part">
        <label className="label-box poppins-medium">CONTENT</label>
        <textarea
          type="text"
          placeholder="Content"
          className="text-area content poppins-regular"
          rows={10}
          value={content}
          onChange={({ target }) => {
            setContent(target.value);
          }}
        />
      </div>
      <div className="part">
        <label className="label-box poppins-medium">TAGS</label>
        <TagInput tags={tags} setTags={setTags} />
      </div>
      {error && <p className="error-text">{error}</p>}
      <button className="poppins-bold add-btn" onClick={handleAddNote}>
        ADD
      </button>
    </div>
  );
};

export default Edit;
