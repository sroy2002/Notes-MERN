import React, { useState } from "react";
import "../Styles/Edit.scss";
import TagInput from "../Components/TagInput";
import { IoMdClose } from "react-icons/io";
import { useAuth0 } from "@auth0/auth0-react";

const Edit = ({ noteData, type, onClose }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [error, setError] = useState(null);
  const { user, getAccessTokenSilently } = useAuth0(); // get user info and token

  // function to add new note
  const addNewNote = async () => {
    try {
      const accessToken = await getAccessTokenSilently(); //get access token
      const noteData = {
        title,
        content,
        tags,
        date: new Date(),
        isPinned: false, // default to false
        userId: user.sub, // fetch user ID fromAuth0 user object
      };

      const response = await fetch(`http://localhost:8000/add-note`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // pass the token in the header
        },
        body: JSON.stringify(noteData), // send the note data to the backend
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Failed to add note.");
      } else {
        setError(null);
        alert("Note added successfully!");
        onClose();
      }
    } catch (error) {
      console.error("Error adding note: ", error);
      setError("An unexpected error occured.");
    }
  };

  // function to edit note
  const editNote = async () => {
    try {
      const accessToken = await getAccessTokenSilently();
      const noteData = {
        title,
        content,
        tags,
        isPinned: false, // Default to false or change as per your app's logic
        userId: user.sub, // Fetch user ID from Auth0 user object
      };
      const response = await fetch(`/edit-note/${noteData._id}`, {
        // Pass the note ID in the URL
        method: "PUT", // Use PUT or PATCH to update the note
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // Pass the token in the header
        },
        body: JSON.stringify(noteData), // Send the updated note data to the backend
      });
      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Failed to edit note.");
      } else {
        setError(null);
        alert("Note updated successfully!");
        onClose(); // Close modal on successful update
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
        ADD
      </button>
    </div>
  );
};

export default Edit;
