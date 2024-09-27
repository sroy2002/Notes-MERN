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
        origin:"*",
    })
);

app.get("/",(req,res)=>{
    res.json({data:"hello"});
});

//add note api
// app.post("/add-note",checkJwt, async (req,res)=>{
//     const {title,content,tags} = req.body;
//     const {user} = req.user;

//     if(!title){
//         return res
//         .status(400)
//         .json({
//             error: true,
//             message: "Title is required!"
//         });
//     }
//     if(!content){
//         return res
//         .status(400)
//         .json({
//             error: true,
//             message: "Content is required!"
//         });
//     }
//     try{
//         const note = new Note({
//             title,
//             content,
//             tags: tags || [],
//             userId: user._id,
//         });
//         await note.save();
//         return res.json(
//             {
//                 error:false,
//                 note,
//                 message: "Note added successfully",
//             }
//         );
//     }
//     catch(error){
//         return res.status(500).json({
//             error: true,
//             message: "Internal Server Error",
//         });
//     }
// })

app.listen(8000);
module.exports = app;