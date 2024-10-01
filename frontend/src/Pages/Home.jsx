import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { IoMdAdd } from "react-icons/io";
import "../Styles/Home.scss";
import Navbar from "../Components/Navbar";
import Notecard from "../Components/Notecard";
import SidePannel from "../Components/SidePannel";
import axios from "../api";
import { useAuth0 } from "@auth0/auth0-react";
import Create from "../Components/Create";
// import { locals } from "../../../backend";

const Home = () => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [notes, setNotes] = useState([]);
  const [panel, setPanel] = useState(false);
  const [openModal, setOpenModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });
  const handlePanel = () => {
    setPanel(!panel);
  };

  //fetch notes from MongoDB when user is logged in

  const fetchNotes = async () => {
    try {
      if (isAuthenticated) {
        const token = await getAccessTokenSilently();
        const response = await axios.get("/notes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setNotes(response.data.notes);
      } else {
        //if not authenticated, load notes from localstorage
        const localNotes = JSON.parse(localStorage.getItem("notes")) || [];
        setNotes(localNotes);
      }
    } catch (error) {
      console.error("Error fetching notes: ", error);
    }
  };

  const fetchGuestNotes = () =>{
    const guestNotes = JSON.parse(sessionStorage.getItem("guestNotes")) || [];
    setNotes(guestNotes);
  }

  useEffect(() => {
    if(isAuthenticated){
      fetchNotes();
    }
    else{
      fetchGuestNotes();
    }
  }, []);


  const updateNote = async (updatedNote) => {
    if (isAuthenticated) {
      const token = await getAccessTokenSilently();
      await axios.put(`/notes/${updatedNote._id}`, updatedNote, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } else {
      const localNotes = JSON.parse(localStorage.getItem("notes")) || [];
      const noteIndex = localNotes.findIndex(
        (note) => note._id === updatedNote._id
      );
      if (noteIndex !== -1) {
        localNotes[noteIndex] = updatedNote;
        localStorage.setItem("notes", JSON.stringify(localNotes));
      }
    }
    fetchNotes(); // refresh notes after editing
  };

  return (
    <div>
      <Navbar handlePanel={handlePanel} />
      <div className="wrapper">
        <div className={`${panel ? "openWidth" : "closeWidth"} panel-div`}>
          <SidePannel panelOpen={panel} />
        </div>
        <div className="sub-container">
          {notes.length ? (
            notes.map((note) => (
              <Notecard
                key={note._id}
                title={note.title}
                content={note.content}
                createdOn={note.createdOn}
                tags={note.tags}
                onEdit={()=>{
                  if(isAuthenticated){
                    setOpenModal({isShown: true, type:"edit",data:note})
                  }
                  else{
                    alert("Login/Sign Up to edit your notes!");
                  }
                }}
              />
            ))
          ) : (
            <p>No Notes to display</p>
          )}
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
        <Create
        fetchGuestNotes={fetchGuestNotes}
          fetchNotes={fetchNotes}
          data = {openModal.data}
          type = {openModal.type}
          onEdit={updateNote}
          onClose={() => {
            setOpenModal({ isShown: false, type: "add", data: null });
          }}
        />
      </Modal>
    </div>
  );
};

export default Home;
