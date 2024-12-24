import React, { useState } from "react";
import { toast } from "react-toastify";
// import { useAuth0 } from "@auth0/auth0-react";
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
  setPinnedCount,
}) => {
  // const { isAuthenticated, loginWithRedirect, getAccessTokenSilently } =
  //   useAuth0(); // Auth0 hook
  const [pinned, setIsPinned] = useState(isPinned);
  const url = "https://notes-mern-backend-1xob.onrender.com"
  const onPinNote = async (noteid) => {
    if (!pinned && pinnedCount >= 3) {
      toast.info("You can only pin up to 3 notes.");
      return;
    }
    try {
      const response = await fetch(
        `${url}/update-pin/${noteid}/pin`,
        {
          method: "PUT",
        }
      );

      //update local pinned state based on server response
      if (response.status === 200) {
        const newPinnedStatus = !pinned;
        setIsPinned(newPinnedStatus);

        // Update pinned count accordingly
        if (newPinnedStatus) {
          setPinnedCount(pinnedCount + 1);
        } else {
          setPinnedCount(pinnedCount - 1);
        }
        toast.success("Pin status updated!");
        fetchNotes();
      }
    } catch (error) {
      console.error("Error pinning the note: ", error);
      toast.error("Failed to update pin status.");
    }
  };

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
            <span className="poppins-regular">{formattedDate}</span>
          </div>
          <div>
            {pinned ? (
              <BsPinFill
                className="pin-icon pinned"
                onClick={() => {
                  onPinNote(noteId);
                }}
              />
            ) : (
              <BsPinAngle
                className="pin-icon not-pinned"
                onClick={() => {
                  onPinNote(noteId);
                }}
              />
            )}
          </div>
        </div>
        <p className="card-content poppins-regular">{content?.slice(0, 60)}</p>
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
