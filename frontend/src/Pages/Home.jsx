import React, { useState } from "react";
import Modal from "react-modal";
import { IoMdAdd } from "react-icons/io";
import "../Styles/Home.scss";
import Navbar from "../Components/Navbar";
import Notecard from "../Components/Notecard";
import SidePannel from "../Components/SidePannel";
import Edit from "./Edit";
const Home = () => {
  const [panel, setPanel] = useState(false);
  const [openModal, setOpenModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });
  const handlePanel = () => {
    setPanel(!panel);
  };
  return (
    <div>
      <Navbar handlePanel={handlePanel} />
      <div className="wrapper">
        <div className={`${panel ? "openWidth" : "closeWidth"} panel-div`}>
          <SidePannel panelOpen={panel} />
        </div>
        <div className="sub-container">
          <Notecard
            title="Meeting"
            date="26th Aug 2024"
            content="Having a meeting on 26th Aug dsjfgysefbchvjbxgreyuetgfchdxvuyertgfbcnxzburytgfgchxbzchhjedg"
            tags="#meeting"
            isPinned={true}
            onEdit={() => {}}
            onDelete={() => {}}
            onPinNote={() => {}}
            className="notecard"
          />
          <Notecard
            title="Meeting"
            date="26th Aug 2024"
            content="Having a meeting on 26th Aug dsjfgysefbchvjbxgreyuetgfchdxvuyertgfbcnxzburytgfgchxbzchhjedg"
            tags="#meeting"
            isPinned={true}
            onEdit={() => {}}
            onDelete={() => {}}
            onPinNote={() => {}}
          />
          <Notecard
            title="Meeting"
            date="26th Aug 2024"
            content="Having a meeting on 26th Aug dsjfgysefbchvjbxgreyuetgfchdxvuyertgfbcnxzburytgfgchxbzchhjedg"
            tags="#meeting"
            isPinned={true}
            onEdit={() => {}}
            onDelete={() => {}}
            onPinNote={() => {}}
          />
        </div>
      </div>
      <div className="create">
        <button
          onClick={() => {
            setOpenModal({ isShown: true, type: "add", data: null });
          }}
        >
          <IoMdAdd />
        </button>
      </div>
      <Modal
        isOpen={openModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.3)",
          },
        }}
        contentLabel=""
        className="modal-styles"
      >
        <Edit onClose={()=>{
          setOpenModal({ isShown: false, type: "add", data: null });
        }}/>
      </Modal>
    </div>
  );
};

export default Home;
