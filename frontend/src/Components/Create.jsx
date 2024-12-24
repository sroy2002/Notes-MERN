import React, { useState, useEffect } from "react";
import "../Styles/Edit.scss";
import TagInput from "./TagInput";
import { IoMdClose } from "react-icons/io";
// import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "react-toastify";
// import { locals } from "../../../backend";

const Create = ({ fetchNotes, data, type, onClose }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [error, setError] = useState(null);
  const url = "https://notes-mern-backend-1xob.onrender.com"
  // function to add new note
  const addNewNote = async () => {
    try {
      const noteData = {
        title,
        content,
        tags,
        date: new Date(),
        isPinned: false, // default to false
      };

      const response = await fetch(`${url}/add-note`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(noteData), // send the note data to the backend
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Failed to add note.");
      } else {
        setError(null);
        toast.success("Note added successfully!");
        onClose();
        fetchNotes();
      }
    } catch (error) {
      console.error("Error adding note: ", error);
      setError("An unexpected error occured.");
    }
  };

  // Populate form with existing note data in edit mode
  useEffect(() => {
    if (type === "edit" && data) {
      setTitle(data.title);
      setContent(data.content);
      setTags(data.tags);
    }
  }, [type, data]);

  // function to edit note
  const editNote = async () => {
    try {
      const noteData = {
        title,
        content,
        tags,
        isPinned: false, // Default to false
      };
      const response = await fetch(
        `${url}/edit-note/${data._id}`,
        {
          // Pass the note ID in the URL
          method: "PUT", // Use PUT or PATCH to update the note
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(noteData), // Send the updated note data to the backend
        }
      );
      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Failed to edit note.");
      } else {
        setError(null);
        toast.success("Note updated successfully!");
        onClose(); // Close modal on successful update
        fetchNotes();
      }
    } catch (error) {
      console.error("Error updating note:", error);
      setError("An unexpected error occurred.");
    }
  };

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
        {type === "edit" ? "UPDATE" : "ADD"}
      </button>
    </div>
  );
};

export default Create;
