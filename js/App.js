import NotesView from "./NotesView.js";
import NotesAPI from "./notesapi.js";

// defines and export App 
export default class App {
    constructor(root) {
        // intialize notes state
        this.notes = []; 
        this.activeNote = null;

        // creates notes view isntance and provides event handlers
        this.view = new NotesView(root, this._handlers());

        // loads and displays notes from local storage
        this._refreshNotes();
    }

    // loads notes from local storage and updates UI 
    _refreshNotes() {
        const notes = NotesAPI.getAllNotes();
        this._setNotes(notes);
        
        // sets first nots as active if notes list is not empty
        if (notes.length > 0) {
            this._setActiveNote(notes[0])
        };


    }

    // update notes & refresh ui 
    _setNotes(notes) {
        this.notes = notes;
        this.view.updateNoteList(notes);

    }

    // sets a note as active
    _setActiveNote(note) { 
        this.activeNote = note;
        this.view.updateActiveNote(note);
        this.view.updateNotePreviewVisibility(notes.length > 0);


    }

    // defines event handlers
    _handlers() {
        return {
            // handles note selection
            onNoteSelect: noteId => {
                const selectedNote = this.notes.find(note => note.id == noteId);
                this._setActiveNote(selectedNote);

            },
            // handles adding a new note
            onNoteAdd: () => {
                const newNote = {
                    title:"New Note",
                    body: "Take note..."
                };

                // saves the note & refreshes the notes list
                NotesAPI.saveNote(newNote);
                this._refreshNotes();

            },

            // handles editing a note
            onNoteEdit: (title, body) => {
                NotesAPI.saveNote({
                    id: this.activeNote.id,
                    title: title,
                    body: body

                });

                this._refreshNotes();
            },

            // handles note deletion
            onNoteDelete: noteId => {
                NotesAPI.deleteNote(noteId);
                this._refreshNotes();
            },
            
        };
    }
}