const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');
const { readFromFile, readAndAppend } = require('./helpers/fsUtils');

// Helper method for generating unique ids
const uuid = require('./helpers/uuid');

const PORT = 3001;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route for notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET Route for retrieving all the notes
app.get('/api/notes', (req, res) => {
  console.info(`${req.method} request received for notes`);
  readFromFile('./db/notes.json').then((data) => res.json(JSON.parse(data)));
});

// POST Route for a note
app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request received to add a note`);
  console.log(req.body);
  const { title, text } = req.body;

  if (req.body) {
    const newNote = {
      title,
      text,
      id: uuid(),
    };

    const response = {
      status: 'success',
      body: newNote,
    };

    console.log(response);

    readAndAppend(newNote, './db/notes.json');
    res.json(`Note added successfully 🚀`);
  } else {
    res.error('Error in adding note');
  }
});

// get route for deleting a specific note
app.delete('/api/notes/:id', (req, res) => {
  if(req.body && req.params.id) {
    const noteId = req.params.id;
    const notes = JSON.parse(fs.readFileSync('./db/notes.json', 'utf8'));
    const newNotes = notes.filter(note => note.id !== noteId);
    fs.writeFileSync('./db/notes.json', JSON.stringify(newNotes));
    res.json('success');
    console.info(`Note deleted successfully 🚀`);
  } else {
    res.error('Error in deleting note');
  }
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
