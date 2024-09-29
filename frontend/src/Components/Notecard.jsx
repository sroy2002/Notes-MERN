import React, { useState } from "react";

import { BsPinFill, BsPinAngle } from "react-icons/bs";
import { MdCreate, MdDelete } from "react-icons/md";
import "../Styles/Notecard.scss";
const Notecard = ({
  title,
  content,
  tags,
  date,
  onEdit,
  onDelete
}) => {

  const [isPinned, setIsPinned] = useState(false);
  function onPinNote(){
    setIsPinned(!isPinned);
  }

  const formattedDate = new Date(date).toLocaleDateString('en-GB',{
    day: 'numeric',
    month: 'short',
    year: 'numeric'
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
            {isPinned ? (
              <BsPinFill className="pin-icon pinned" onClick={onPinNote} />
            ) : (
              <BsPinAngle className="pin-icon not-pinned" onClick={onPinNote} />
            )}
          </div>
        </div>
        <p className="card-content">{content?.slice(0, 60)}</p>
        <div className="bottom">
          <div className="note-tags">
            {
              tags?.length > 0 && tags.map((tag,index)=>(
                <span key={index} className="tag">
                  #{tag}
                </span>
              ))
            }
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
