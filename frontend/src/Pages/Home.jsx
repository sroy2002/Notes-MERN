import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BiSolidPencil } from "react-icons/bi";
import "../Styles/Home.scss";
import Navbar from "../Components/Navbar";
import Notecard from "../Components/Notecard";
import SidePannel from "../Components/SidePannel";
import axios from "../api";

import { toast } from "react-toastify";
import Create from "../Components/Create";
import NotFound from "../Components/NotFound";
import AddNote from "../Components/AddNote";

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [panel, setPanel] = useState(false);
  const [pinnedCount, setPinnedCount] = useState(0);
  const [btnTrig, setBtnTrig] = useState(null);
  const [isSearch, setIsSearch] = useState(false);
  const [searchError, setSearchError] = useState(false);

  const [openModal, setOpenModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const triggerRef = useRef(null);

  const modalVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.42, 0, 0.58, 1] },
    },
    exit: {
      opacity: 0,
      y: 20,
      transition: { duration: 0.3 },
    },
  };
  const backdropVariants = {
    hidden: (btnTrig) => ({
      opacity: 0,
      clipPath: `circle(30px at ${btnTrig?.left || 50}px ${
        btnTrig?.top || 50
      }px)`,
      transition: {
        duration: 0.5,
      },
    }),
    visible: (btnTrig) => ({
      opacity: 1,
      clipPath: `circle(150% at ${btnTrig?.left || 50}px ${
        btnTrig?.top || 50
      }px)`,
      transition: {
        duration: 0.6,
        ease: [0.42, 0, 0.58, 1], // easeInOut
      },
    }),
    exit: (btnTrig) => ({
      opacity: 0,
      clipPath: `circle(30px at ${btnTrig?.left || 50}px ${
        btnTrig?.top || 50
      }px)`,
      transition: {
        duration: 0.5,
      },
    }),
  };

  useEffect(() => {
    if (searchError || notes.length === 0) {
      document.body.classList.add("blank-background");
      document.body.classList.remove("pattern-background");
    } else {
      document.body.classList.add("pattern-background");
      document.body.classList.remove("blank-background");
    }

    if (triggerRef.current && openModal.isShown) {
      const rect = triggerRef.current.getBoundingClientRect();
      setBtnTrig(rect);
    }

    // Cleanup on component unmount
    return () => {
      document.body.classList.remove("pattern-background", "blank-background");
    };
  }, [searchError, notes, openModal.isShown]);

  const handlePanel = () => {
    setPanel(!panel);
  };

  //fetch notes from MongoDB when user is logged in

  const fetchNotes = async () => {
    try {

      const response = await axios.get("/home");

      const fetchedNotes = response.data.notes;
      //Separate pinned and unpinned notes
      const pinnedNotes = fetchedNotes.filter((note) => note.isPinned);
      const unpinnedNotes = fetchedNotes.filter((note) => !note.isPinned);

      pinnedNotes.sort((a, b) => new Date(b.pinnedAt) - new Date(a.pinnedAt));

      const combinedNotes = [...pinnedNotes, ...unpinnedNotes];
      setNotes(combinedNotes);
      setPinnedCount(pinnedNotes.length); // Update pinned count here
    } catch (error) {
      console.error("Error fetching notes: ", error);
    }
  };

  // const fetchGuestNotes = () => {
  //   const guestNotes = JSON.parse(sessionStorage.getItem("guestNotes")) || [];
  //   setNotes(guestNotes);
  // };

const fetchUserNotes = async () => {
    try {
      // Add logic to fetch authenticated user notes here
      await fetchNotes();
    } catch (error) {
      console.error("Error fetching notes: ", error);
    }
  };

  useEffect(() => {
    fetchUserNotes();
  },[]);

  // function to edit notes
  const updateNote = async (updatedNote) => {
    await axios.put(`/notes/${updatedNote._id}`, updatedNote);
    fetchNotes(); // refresh notes after editing
  };

  // function to delete notes
  const deleteNote = async (noteId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/delete-note/${noteId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const result = await response.json();
        toast.error("Failed to delete the note!");
        console.log(result);
      } else {
        toast.success("Note deleted successfully!");
        fetchNotes();
      }
    } catch (error) {
      toast.error("Note deletion failed!");
      console.log("Error deleting note: ", error);
    }
  };

  const onDelete = (noteId) => {
    deleteNote(noteId);
  };

  // function to search for a note (authenticated users only)
  const onSearchNote = async (query) => {
    try {
      const response = await axios.get("/search-notes", {
        params: { query },
      });
      console.log(response.data.notes);
      if (response.data && response.data.notes) {
        setIsSearch(true);
        return response.data.notes;
      }
      return [];
    } catch (error) {
      console.error("Error searching notes: ", error);
    }
  };
  return (
    <div>
      <Navbar
      notes={notes}
        handlePanel={handlePanel}
        setNotes={setNotes}
        onSearchNote={onSearchNote}
        fetchNotes={fetchNotes}
        setSearchError={setSearchError}
        // profileImage={profileImg}
        // setProfileImage = {setProfileImg}
      />
      <div className="wrapper">
        <div className={`${panel ? "openWidth" : "closeWidth"} panel-div`}>
          <SidePannel panelOpen={panel} />
        </div>

        <div className="sub-container">
          {notes.length ? (
            notes.map(
              (note) =>
                note && (
                  <Notecard
                    key={note._id}
                    title={note.title}
                    content={note.content}
                    createdOn={note.createdOn}
                    noteId={note._id}
                    isPinned={note.isPinned}
                    tags={note.tags}
                    onEdit={() => {
                      setOpenModal({ isShown: true, type: "edit", data: note });
                    }}
                    onDelete={() => {
                      onDelete(note._id);
                    }}
                    fetchNotes={fetchNotes}
                    pinnedCount={pinnedCount} // Pass current pinned count
                    setPinnedCount={setPinnedCount} // Pass function to update pinned count
                  />
                )
            )
          ) : (
            <div className="empty-state">
              {isSearch ? (
                searchError ? (
                  <NotFound />
                ) : (
                  <AddNote />
                )
              ) : (
                <AddNote />
              )}
            </div>
          )}
        </div>
      </div>
      <div className="create">
        <motion.button
          ref={triggerRef}
          onClick={(e) => {
            const buttonRect = e.currentTarget.getBoundingClientRect();
            setBtnTrig({
              left: `${buttonRect.left + buttonRect.width / 2}`, // Center of the button
              top: `${buttonRect.top + buttonRect.height / 2}`, // Center of the button
              width: buttonRect.width,
              height: buttonRect.height,
            });
            setOpenModal({ isShown: true, type: "add", data: null });
          }}
          whileHover={{
            scale: 1.2,
            boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.3)",
          }}
          whileTap={{ scale: 0.8 }}
          transition={{ duration: 0.01 }}
        >
          <BiSolidPencil />
        </motion.button>
      </div>

      <AnimatePresence>
        {openModal.isShown && (
          <>
            <motion.div
              custom={btnTrig}
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="backdrop"
              onClick={() => {
                setOpenModal({ isShown: false, type: "add", data: null });
                setBtnTrig(null);
              }}
            >
              <motion.div
                className="modal-wrapper"
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={(e) => e.stopPropagation()}
              >
                <Create
                
                  fetchNotes={fetchNotes}
                  data={openModal.data}
                  type={openModal.type}
                  onEdit={updateNote}
                  onClose={() => {
                    setOpenModal({ isShown: false, type: "add", data: null });
                    setBtnTrig(null);
                  }}
                />
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
