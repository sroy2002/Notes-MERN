require("dotenv").config();
//mongoDB connection
const config = require("./config.json");
const mongoose = require("mongoose");
const {
  Types: { ObjectId },
} = require("mongoose");
mongoose.connect(config.connectionString);
const Note = require("./models/note.model");

const express = require("express");
const cors = require("cors");
const app = express();
const { auth } = require("express-oauth2-jwt-bearer");

//middleware
const checkJwt = auth({
  audience: "https://my-notes-app",
  issuerBaseURL: `https://dev-2zvnt7b3vewhots2.us.auth0.com/`,
  tokenSigningAlg: "RS256",
});

app.use(express.json());

app.use(
  cors({
    origin: [
      "https://notes-mern-nine.vercel.app", // Your frontend URL
      "http://localhost:3000", // Local frontend development
      "http://localhost:5173", // If using Vite default port
      "https://dev-2zvnt7b3vewhots2.us.auth0.com",
    ], // Your Auth0 domain],
    methods: ["POST", "GET", "PUT", "DELETE"], // Allow frontend to access backend
    credentials: true, // Allow cookies to be sent with requests
    // methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.get("/", (req, res) => {
  res.redirect("https://dev-2zvnt7b3vewhots2.us.auth0.com/login");
});

//fetch notes for the autheticated user
app.get("/home", checkJwt, async (req, res) => {
  try {
    const user = req.auth.payload; // get the authenticated user's info
    const notes = await Note.find({ userId: user.sub }).sort({
      isPinned: -1,
      pinnedAt: -1,
    }); //Fetch notes for this user
    res.json({ notes });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: "Failed to fetch notes",
    });
  }
});
//add note api
app.post("/add-note", checkJwt, async (req, res) => {
  const { title, content, tags } = req.body;
  const user = req.auth.payload;

  if (!title) {
    return res.status(400).json({
      error: true,
      message: "Title is required!",
    });
  }
  if (!content) {
    return res.status(400).json({
      error: true,
      message: "Content is required!",
    });
  }
  try {
    const newNote = new Note({
      title,
      content,
      tags: tags || [],
      userId: user.sub, //save note with user's id
    });
    await newNote.save();
    return res.status(201).json({
      error: false,
      newNote,
      message: "Note added successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

//edit notes api
app.put("/edit-note/:id", checkJwt, async (req, res) => {
  const noteId = req.params.id;
  // const {title, content, tags, isPinned} = req.body;
  // const {user} = req.user;

  const updatedNote = req.body;

  try {
    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    //update the note fields with the new data

    note.title = updatedNote.title;
    note.content = updatedNote.content;
    note.tags = updatedNote.tags || [];
    note.createdOn = new Date(); //update the timestamp

    //save the updated note back to the database
    await note.save();
    res.status(200).json({ message: "Note updated successfully!", note });
  } catch (error) {
    res.status(500).json({ message: "Error updating note", error });
  }
});

//delete notes api
app.delete("/delete-note/:id", async (req, res) => {
  try {
    const noteId = req.params.id;

    //find the note by ID and delete it
    const result = await Note.findByIdAndDelete(noteId);
    if (!result) {
      return res.status(404).json({ message: "Note not found!" });
    }
    res.status(200).json({ message: "Note deleted successfully!" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the note" });
  }
});

//update pin status
app.put("/update-pin/:id/pin", checkJwt, async (req, res) => {
  try {
    const userId = req.auth.payload.id;
    const noteId = req.params.id;
    if (!ObjectId.isValid(noteId)) {
      return res.status(400).json({ message: "Invalid note ID" });
    }
    // Find all pinned notes for the user
    const pinnedNotes = await Note.find({ userId: userId, isPinned: true });

    // Check if the user has already pinned 3 notes
    if (pinnedNotes.length >= 3) {
      return res
        .status(400)
        .json({ message: "You can only pin up to 3 notes." });
    }
    console.log("Note ID:", noteId);
    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    note.isPinned = !note.isPinned; //toggle pin status
    note.pinnedAt = note.isPinned ? new Date() : null;
    await note.save();
    res.json({ message: "Note Pin status updated", note });
  } catch (error) {
    console.error("Error in /notes/:id/pin route:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// search notes api
app.get("/search-notes/", checkJwt, async (req, res) => {
  const { query } = req.query;
  const user = req.auth.payload;

  if (!user) {
    return res
      .status(401)
      .json({ error: true, message: "User not authenticated." });
  }

  if (!query) {
    return res
      .status(400)
      .json({ error: true, message: "Search query is required!" });
  }

  try {
    const matchingNotes = await Note.find({
      userId: user.sub,
      $or: [
        { title: { $regex: new RegExp(query, "i") } },
        { content: { $regex: new RegExp(query, "i") } },
        { tags: { $regex: new RegExp(query, "i") } },
      ],
    });

    return res.json({
      error: false,
      notes: matchingNotes,
      message: "Notes matching the search query retrieved success",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

app.listen(8000);
module.exports = app;
