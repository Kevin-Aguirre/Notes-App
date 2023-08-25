// frontend: tracks user interactions + manages and updates ui (user interface) of notes app (adding, editing, and displaying notes)
// defines and exports NotesView
//root refers to the div with class of notes and id of app
// inside isntructor we can directly grab the values of these keys
export default class NotesView {
    constructor(root, { onNoteSelect, onNoteAdd, onNoteEdit, onNoteDelete } = {}) { // root is an html element where notes view will be rendered
        this.root = root;
        this.onNoteAdd = onNoteAdd;
        this.onNoteSelect = onNoteSelect;
        this.onNoteEdit = onNoteEdit;
        this.onNoteDelete = onNoteDelete;
        // creates the layout of the notes app, includes sidebar, button, and preview
        this.root.innerHTML = `
            <div class="notes__sidebar">
                <button class="notes__add" type="button">Add Note</button>
                <button class="notes__delete" type="button">Delete Note</button>
                <div class="notes__list"></div>
            </div>
            <div class="notes__preview">    
                <input class="notes__title" type="text" placeholder="New Note...">
                <textarea class="notes__body">What's on your mind?</textarea>
            </div>
        `;

        // stores refers to add note button, input title, and input body respectively
        const btnAddNote = this.root.querySelector(".notes__add")
        const btnDeleteNote = this.root.querySelector(".notes__delete")
        const inpTitle = this.root.querySelector(".notes__title")
        const inpBody = this.root.querySelector(".notes__body")

        // when add note button is clicked
        btnAddNote.addEventListener("click", () => {
            console.log(this.root.innerHTML);
            this.onNoteAdd();
        });

        // when delete note button is clicled
        btnDeleteNote.addEventListener("click", () => {
            let element = document.querySelector(".notes__small-body")
            if (element) {
                const doDelete = confirm(`Are you sure you want to delete the note you have selected?`);
                if (doDelete) {
                    this.onNoteDelete();
                }
            } else {
                alert('Your Notes List is empty.')
            };
        });


        //inputField acts as a temporary variable to represent inpTitle or inpBody
        //blur even toccurs when a user interacts iwth an input field, then clicks away from it
        [inpTitle, inpBody].forEach(inputFied => {
            inputFied.addEventListener("blur", () => {
                //value gets content of input fields, trim removes leading & trailing whitesapce
                const updatedTitle = inpTitle.value.trim();
                const updatedBody = inpBody.value.trim();

                // notifies app when user has finsihed editiing the titel or body of a note
                this.onNoteEdit(updatedTitle, updatedBody);

            });
        });
    }

    _createListItemHTML(id, title, body, updated) {
        //maximum note preview length before it gets turned into elipsis
        const MAX_BODY_LENGTH = 60;

        // creates a list item in the notes sidebar
        return `
            <div class="notes__list-item" data-note-id="${id}">
                <div class="notes__small-title">${title}</div>
                <div class="notes__small-body">
                    ${body.substring(0, MAX_BODY_LENGTH)}
                    ${body.length > MAX_BODY_LENGTH ? "..." : ""}
                </div>

                <div class="notes__small-updated">
                ${updated.toLocaleString(undefined, { dateStyle: "full", timeStyle: "short" })}
                </div>


            </div>
        `;
    }

    // clears exisitng note list. generates and inserts html for each note, and sets up event lsiteneres for selecting and edeelting ntoes
    updateNoteList(notes) {
        const notesListContainer = this.root.querySelector(".notes__list");

        // empty list
        notesListContainer.innerHTML = "";

        // create list html for each element, and then insert it at the end of the list container
        for (const note of notes) {
            const html = this._createListItemHTML(note.id, note.title, note.body, new Date(note.updated));
            notesListContainer.insertAdjacentHTML("beforeend", html);

        }

        // adds events listeners for each note in the notes list
        notesListContainer.querySelectorAll(".notes__list-item").forEach(notesListItem => {
            notesListItem.addEventListener("click", () => {
                this.onNoteSelect(notesListItem.dataset.noteId);
            });

        });
    }

    //update active note title and body in ui 
    updateActiveNote(note) {
        // sets value of title & body input fields to match updates values
        this.root.querySelector(".notes__title").value = note.title;
        this.root.querySelector(".notes__body").value = note.body;


        this.root.querySelectorAll(".notes__list-item").forEach(noteListItem => {
            noteListItem.classList.remove("notes__list-item--selected");
        });

        this.root.querySelector(`.notes__list-item[data-note-id="${note.id}"]`).classList.add("notes__list-item--selected");

    }

    updateNotePreviewVisibility(visible) {
        this.root.querySelector(".notes__preview").style.visibility = visible ? "visible" : "hidden";
    }
}
