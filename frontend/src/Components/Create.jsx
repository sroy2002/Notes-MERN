import React, { useState, useEffect } from "react";
import "../Styles/Edit.scss";
import TagInput from "./TagInput";
import { IoMdClose } from "react-icons/io";
import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "react-toastify";
// import { locals } from "../../../backend";

const Create = ({ fetchGuestNotes, fetchNotes, data, type, onClose }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [error, setError] = useState(null);
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0(); // get user info and token

  // Function to add a new note to localStorage (for unauthenticated users)

  const addNoteToLocalStorage = () => {
    const newNote = {
      id: new Date().getTime(), //unique id for each note
      title,
      content,
      tags,
      createdOn: new Date(),
      isPinned: false,
    };

    let notes = JSON.parse(sessionStorage.getItem("guestNotes")) || [];
    notes.push(newNote);
    sessionStorage.setItem("guestNotes", JSON.stringify(notes));
    onClose();
    fetchGuestNotes();
  };

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
      const accessToken = await getAccessTokenSilently();
      const noteData = {
        title,
        content,
        tags,
        isPinned: false, // Default to false
        userId: user.sub, // Fetch user ID from Auth0 user object
      };
      const response = await fetch(
        `http://localhost:8000/edit-note/${data._id}`,
        {
          // Pass the note ID in the URL
          method: "PUT", // Use PUT or PATCH to update the note
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`, // Pass the token in the header
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

  // edit notes for guest users

  const editNoteInSessionStorage = () => {
    const guestNotes = JSON.parse(sessionStorage.getItem("guestNotes")) || [];
    const updateNotes = guestNotes.map((note) => {
      if (note.id === data.id) {
        return { ...title, content, tags };
      } else {
        return note;
      }
    });
    sessionStorage.setItem("guestNotes", JSON.stringify(updateNotes));
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
    if (isAuthenticated) {
      if (type === "edit") {
        editNote();
      } else {
        addNewNote();
      }
    } else {
      if (type === "edit") {
        editNoteInSessionStorage();
        onClose();
        fetchGuestNotes();
        toast.success("Note updated!");
      } else {
        addNoteToLocalStorage();
        toast.success("Note added!");
      }
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
