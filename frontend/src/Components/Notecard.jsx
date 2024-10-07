import React, { useState } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { BsPinFill, BsPinAngle } from "react-icons/bs";
import { MdCreate, MdDelete } from "react-icons/md";
import "../Styles/Notecard.scss";
const Notecard = ({
  title,
  content,
  tags,
  createdOn,
  noteId,
  isPinned,
  onEdit,
  onDelete,
  fetchNotes,
  pinnedCount,
  setPinnedCount
}) => {
  const { isAuthenticated, loginWithRedirect, getAccessTokenSilently } =
  useAuth0(); // Auth0 hook
  const [pinned, setIsPinned] = useState(isPinned);

  
  const onPinNote = async (noteid) => {
    if (isAuthenticated) {
       // Check if pinning limit is reached
       if (!pinned && pinnedCount >= 3) {
        alert("You can only pin up to 3 notes.");
        return;
      }
      try {
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(
          `http://localhost:8000/update-pin/${noteid}/pin`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${accessToken}`, //pass the token in the header
            },
          }
        );

        //update local pinned state based on server response
        if(response.status === 200){
          const newPinnedStatus = !pinned;
          setIsPinned(newPinnedStatus);

          // Update pinned count accordingly
          if (newPinnedStatus) {
            setPinnedCount(pinnedCount + 1);
          } else {
            setPinnedCount(pinnedCount - 1);
          }
          alert("Pin status updated!");
          fetchNotes();
        }
      } catch (error) {
        console.error("Error pinning the note: ", error);
        alert("Failed to update pin status.");
      }
    } else {
      alert("You need to sign up/login to pin your notes!");
      loginWithRedirect();
      return;
    }
  }

  const formattedDate = new Date(createdOn).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="card">
      <div className="parent">
        <div className="upper">
          <div className="card-heading">
            <p className="poppins-semibold">{title}</p>
            <span>{formattedDate}</span>
          </div>
          <div>
            {pinned ? (
              <BsPinFill
                className="pin-icon pinned"
                onClick={() => {
                  console.log("Pin icon clicked for note ID:", noteId);
                  onPinNote(noteId);
              }}
              />
            ) : (
              <BsPinAngle
                className="pin-icon not-pinned"
                onClick={() => {
                  console.log("Pin icon clicked for note ID:", noteId);
                  onPinNote(noteId);
              }}
              />
            )}
          </div>
        </div>
        <p className="card-content">{content?.slice(0, 60)}</p>
        <div className="bottom">
          <div className="note-tags">
            {tags?.length > 0 &&
              tags.map((tag, index) => (
                <span key={index} className="tag">
                  #{tag}
                </span>
              ))}
          </div>
          <div className="edit-notes">
            <MdCreate onClick={onEdit} className="icon icon1" />
            <MdDelete onClick={onDelete} className="icon icon2" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notecard;
