import React from "react";

import "../Styles/Panel.scss";
const SidePannel = ({ panelOpen }) => {
  return (
    <div className={`panel-parent  ${panelOpen ? "open" : "close"}`}>
      <div className="user-profile">
        <p className="notice">HI</p>
      </div>
    </div>
  );
};

export default SidePannel;
