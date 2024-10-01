require("dotenv").config();
//mongoDB connection
const config = require("./config.json");
const mongoose = require("mongoose");
mongoose.connect(config.connectionString);
const Note = require("./models/note.model");
const express = require("express");
const cors = require("cors");
const app = express();
const { auth } = require('express-oauth2-jwt-bearer');

//middleware
const checkJwt = auth({
    audience: 'https://my-notes-app',
    issuerBaseURL: `https://dev-2zvnt7b3vewhots2.us.auth0.com/`,
    tokenSigningAlg: 'RS256'
  });


app.use(express.json());

app.use(
    cors({
        origin:"http://localhost:5173",
    })
);

app.get("/",(req,res)=>{
    res.json({data:"hello"});
});
//fetch notes for the autheticated user
app.get("/notes",checkJwt,async(req,res)=>{
    try{
        const user = req.auth.payload; // get the authenticated user's info
        const notes = await Note.find({userId:user.sub});//Fetch notes for this user
        res.json({notes});
    }
    catch(error){
        res.status(500).json({
            error:true,
            message:"Failed to fetch notes",
        });
    }
});
//add note api
app.post("/add-note",checkJwt, async (req,res)=>{
    const {title,content,tags} = req.body;
    const user = req.auth.payload;

    if(!title){
        return res
        .status(400)
        .json({
            error: true,
            message: "Title is required!"
        });
    }
    if(!content){
        return res
        .status(400)
        .json({
            error: true,
            message: "Content is required!"
        });
    }
    try{
        const newNote = new Note({
            title,
            content,
            tags: tags || [],
            userId: user.sub, //save note with user's id
        });
        await newNote.save();
        return res.status(201).json(
            {
                error:false,
                newNote,
                message: "Note added successfully",
            }
        );
    }
    catch(error){
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
})


//edit notes api
app.put("/edit-note/:id", checkJwt,async(req,res)=>{
    const noteId = req.params.id;
    // const {title, content, tags, isPinned} = req.body;
    // const {user} = req.user;

    const updatedNote = req.body;

    try{
        const note = await Note.findById(noteId);
        if(!note){
            return res.status(404).json({message: 'Note not found'});
        }

        //update the note fields with the new data

        note.title = updatedNote.title;
        note.content = updatedNote.content;
        note.tags = updatedNote.tags || [];
        note.createdOn = new Date(); //update the timestamp

        //save the updated note back to the database
        await note.save();
        res.status(200).json({message:"Note updated successfully!",note});
    } catch(error){
        res.status(500).json({message: 'Error updating note', error});
    }
    
});

app.listen(8000);
module.exports = app;