import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, transform } from "framer-motion";
import { BiSolidPencil } from "react-icons/bi";
import "../Styles/Home.scss";
import Navbar from "../Components/Navbar";
import Notecard from "../Components/Notecard";
import SidePannel from "../Components/SidePannel";
import axios from "../api";
import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "react-toastify";
import Create from "../Components/Create";
import NotFound from "../Components/NotFound";
import AddNote from "../Components/AddNote";
// import { locals } from "../../../backend";

const Home = () => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
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
      clipPath: `circle(0px at ${btnTrig?.left || "50%"} ${
        btnTrig?.top || "50%"
      })`,
      transition: {
        duration: 0.5,
      },
    }),
    visible: (btnTrig) => ({
      opacity: 1,
      clipPath: `circle(2000px at ${btnTrig?.left || "50%"} ${
        btnTrig?.top || "50%"
      })`,
      transition: {
        duration: 0.6,
        ease: [0.42, 0, 0.58, 1], // easeInOut
      },
    }),
    exit: (btnTrig) => ({
      opacity: 0,
      clipPath: `circle(0px at ${btnTrig?.left || "50%"} ${
        btnTrig?.top || "50%"
      })`,
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
      if (isAuthenticated) {
        const token = await getAccessTokenSilently();
        const response = await axios.get("/notes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const fetchedNotes = response.data.notes;

        //Separate pinned and unpinned notes
        const pinnedNotes = fetchedNotes.filter((note) => note.isPinned);
        const unpinnedNotes = fetchedNotes.filter((note) => !note.isPinned);

        pinnedNotes.sort((a, b) => new Date(b.pinnedAt) - new Date(a.pinnedAt));

        const combinedNotes = [...pinnedNotes, ...unpinnedNotes];
        setNotes(combinedNotes);
        setPinnedCount(pinnedNotes.length); // Update pinned count here
      } else {
        //if not authenticated, load notes from localstorage
        const localNotes = JSON.parse(localStorage.getItem("notes")) || [];
        setNotes(localNotes);
      }
    } catch (error) {
      console.error("Error fetching notes: ", error);
    }
  };

  const fetchGuestNotes = () => {
    const guestNotes = JSON.parse(sessionStorage.getItem("guestNotes")) || [];
    setNotes(guestNotes);
  };

  useEffect(() => {
    const fetchUserNotes = async () => {
      if (isAuthenticated) {
        await fetchNotes();
      } else {
        fetchGuestNotes();
      }
    };
    fetchUserNotes();
  }, [isAuthenticated]);

  // function to edit notes
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

  // function to delete notes
  const deleteNote = async (noteId) => {
    try {
      const accessToken = await getAccessTokenSilently();
      const response = await fetch(
        `http://localhost:8000/delete-note/${noteId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`, //pass the token in the header
          },
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

  //Function to delete note from session storage for guest users
  const deleteNoteForGuests = (noteId) => {
    let notes = JSON.parse(sessionStorage.getItem("guestNotes")) || [];
    // Log the notes and the noteId to be deleted
    console.log("Notes before deletion:", notes);
    console.log("Note to delete (ID):", noteId);
    notes = notes.filter((note) => note.id !== noteId); //use unique id for filtering
    console.log("Notes after deletion:", notes);
    sessionStorage.setItem("guestNotes", JSON.stringify(notes));
    console.log(
      "Updated sessionStorage:",
      sessionStorage.getItem("guestNotes")
    );
    toast.error("Note deleted!");
    fetchGuestNotes();
  };

  const onDelete = (noteId) => {
    if (isAuthenticated) {
      deleteNote(noteId);
    } else {
      console.log(noteId);
      deleteNoteForGuests(noteId);
    }
  };

  // function to search for a note (authenticated users only)
  const onSearchNote = async (query) => {
    try {
      const token = await getAccessTokenSilently();
      const response = await axios.get("/search-notes", {
        params: { query },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data && response.data.notes) {
        setIsSearch(true);
        setNotes(response.data.notes);
      }
    } catch (error) {
      console.error("Error searching notes: ", error);
    }
  };
  return (
    <div>
      <Navbar
        handlePanel={handlePanel}
        setNotes={setNotes}
        onSearchNote={onSearchNote}
        fetchNotes={fetchNotes}
        fetchGuestNotes={fetchGuestNotes}
        setSearchError={setSearchError}
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
                      if (isAuthenticated) {
                        onDelete(note._id);
                      } else {
                        onDelete(note.id);
                      }
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
            const buttonRect = e.target.getBoundingClientRect();
            setBtnTrig({
              left: `${buttonRect.left + buttonRect.width / 2}px`, // Center of the button
              top: `${buttonRect.top + buttonRect.height / 2}px`, // Center of the button
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
                {/* <Modal
                  shouldCloseOnOverlayClick={true}
                  // isOpen={openModal.isShown}
                  onRequestClose={() => {
                    setOpenModal({ isShown: false, type: "add", data: null });
                    setBtnTrig(null);
                  }}
                  style={{
                    overlay: {
                      backgroundColor: "rgba(0,0,0,0.3)",
                    },
                  }}
                  className="modal-styles"
                > */}
                <Create
                  fetchGuestNotes={fetchGuestNotes}
                  fetchNotes={fetchNotes}
                  data={openModal.data}
                  type={openModal.type}
                  onEdit={updateNote}
                  onClose={() => {
                    setOpenModal({ isShown: false, type: "add", data: null });
                    setBtnTrig(null);
                  }}
                />
                {/* </Modal> */}
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
