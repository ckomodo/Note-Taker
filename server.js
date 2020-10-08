//dependencies
const express = require("express");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require('uuid');

//sets up express app
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// This tells express to look inside the public folder for your static assets like js, css, and images
app.use(express.static("public"));

//routes to return notes and index html files
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

// api routes
app.get("/api/notes", function (req, res) {
    fs.readFile("./db/db.json", "utf8", function (err, data) {
        if (err) throw err;
        res.json(JSON.parse(data))
    })
})

app.post("/api/notes", function (req, res) {
    const newNote = req.body;
    fs.readFile("./db/db.json", "utf8", function (err, data) {
        if (err) throw err;
        const notes = JSON.parse(data);

        const id = uuidv4();
        // the syntax below will add a property to the object
        newNote.id = id;

        notes.push(newNote);

        fs.writeFile("./db/db.json", JSON.stringify(notes), "utf8", function (err) {
            if (err) throw err;
            res.json(newNote);
        })
    })
})

app.delete("/api/notes/:id", function (req, res){
    const id = req.params.id;
    fs.readFile("./db/db.json", "utf8", function (err, data) {
        if (err) throw err;
        const notes = JSON.parse(data);

        const result = notes.filter(note => note.id !== id);
        console.log(result);

        fs.writeFile("./db/db.json", JSON.stringify(result), "utf8", function (err) {
            if (err) throw err;
            res.json("Success!");
        })
    })
})

app.listen(PORT, function () {
    console.log("App listening on PORT: " + PORT);
});