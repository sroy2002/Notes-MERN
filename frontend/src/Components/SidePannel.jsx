import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import "../Styles/Panel.scss";
const SidePannel = ({ panelOpen }) => {
  const { isAuthenticated, user } = useAuth0();
  return (
    <div className={`panel-parent  ${panelOpen ? "open" : "close"}`}>
      <div className="user-profile">
        {isAuthenticated ? (
          <div className="panel-user-pic">
            <img src={user.picture} alt={user.name} />
            <p>{user.email}</p>
          </div>
        ) :(
          <p className="notice">*Please Login/Sign up</p>
        )}
      </div>
    </div>
  );
};

export default SidePannel;
