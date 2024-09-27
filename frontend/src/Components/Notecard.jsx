import React from "react";

import { BsPinFill, BsPinAngle } from "react-icons/bs";
import { MdCreate, MdDelete } from "react-icons/md";
import "../Styles/Notecard.scss";
const Notecard = ({
  title,
  date,
  content,
  tags,
  isPinned,
  onEdit,
  onDelete,
  onPinNote,
}) => {
  return (
    <div className="card">
      <div className="parent">
        <div className="upper">
          <div className="card-heading">
            <p className="poppins-semibold">{title}</p>
            <span>{date}</span>
          </div>
          <div>
            {isPinned ? (
              <BsPinFill className="pin-icon pinned" />
            ) : (
              <BsPinAngle className="pin-icon not-pinned" onClick={onPinNote} />
            )}
          </div>
        </div>
        <p className="card-content">{content?.slice(0, 60)}</p>
        <div className="bottom">
          <p>{tags}</p>
          <div>
            <MdCreate onClick={onEdit} className="icon icon1" />
            <MdDelete onClick={onDelete} className="icon icon2" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notecard;
