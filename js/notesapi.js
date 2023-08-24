//both exports and defines NotesAPI
export default class NotesAPI {
    // retrieves notes from local storage using key "notes-app notes", returns an empty array if no notes found
    static getAllNotes() {
        //JSON.parse returns string to original data structure
        const notes = JSON.parse(localStorage.getItem("notesapp-notes") || "[]"); 
        // returns sorted notes.  a comparison function is passed into sort() to compare the updates dates of the notes and sorts them based on most recent changs. sorts while array
        return notes.sort((a, b) => {
            return new Date(a.updated) > new Date(b.updated)
        });
    }

    //responsible for saving notes wheter it exists or not
    static saveNote(noteToSave) {
        // retrives notes from local storage
        const notes = NotesAPI.getAllNotes();
        // if noteToSave exists in the notes local storage, note will be assigned to existing, otherwise it will be null
        const existing = notes.find(note => note.id == noteToSave.id)


        if (existing) {
            // the updated information from the noteToSave overwrite the old information of the exisitng note
            existing.title = noteToSave.title;
            existing.body = noteToSave.body;
            existing.updated = new Date().toISOString();
        } else {
            // if the id of the noteToSave doesn't match any existing notes, a new note is made to add to the notes local storage. 
            noteToSave.id = Math.floor(Math.random() * 1000000) // generate note id 
            noteToSave.updated = new Date().toISOString(); // saves current time to updated propert
            notes.push(noteToSave); // adds new note to notes
    
        }

        // overwrites notes in local storage 
        localStorage.setItem("notesapp-notes", JSON.stringify(notes));
    }

    // deletes a notes after passing in its id
    static deleteNote(id) {
        const notes = NotesAPI.getAllNotes() //get all notes
        const newNotes = notes.filter(note => note.id != id); // adds all notes to newNotes, unless it matches the id of the note that is to be deleted
        localStorage.setItem("notesapp-notes", JSON.stringify(newNotes)); // overwrites & updates notes after deleting a note

    }
}
