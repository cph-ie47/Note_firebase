const list = document.querySelector("ul");
const form = document.querySelector("form");

const add_note = (note, id) => {
    let html = `
        <li data-id="${id}">
            <div>${note.Title}</div>
            <div>${note.Notat}</div>
            <div>Created at: ${note.created_at.toDate().toLocaleString()}</div>
            <div>Important: <input type="checkbox" id="importantCheck"></div>
            <button class="btn btn-danger btn-sm my-2" id="delete">Delete</button>
            <button class="btn btn-warning btn-sm my-2" id="edit">Edit</button>
        </li>
    `;

    list.innerHTML += html;
}

const delete_note = (id) => {
    const notes = document.querySelectorAll('li');
    notes.forEach(note => {
        if (note.getAttribute('data-id') === id) {
            note.remove();
        }
    })
}

// Get the notes
db.collection('notes').onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
        const doc = change.doc;
        if (change.type === 'added') {
            add_note(doc.data(), doc.id);
        } else if (change.type === 'removed') {
            delete_note(doc.id);
        }
    });
});


// Add notes
form.addEventListener('submit', e => {
    e.preventDefault();
    const now = new Date();
    const note = {
        Title: form.note_title.value,
        Notat: form.note.value,
        created_at: firebase.firestore.Timestamp.fromDate(now),
       
    };
    form.reset();


    db.collection('notes').add(note).then(() => {
        console.log("The note is now added.")
    }).catch(err => {
        console.log(err);
    });
});


// Deleting notes
list.addEventListener('click', e => {
    if (e.target.id == "delete") {
        console.log(e);
        const id = e.target.parentElement.getAttribute('data-id');
        db.collection('notes').doc(id).delete().then(() => {
            console.log("The note is now deleted.")
        });
    }
});

// Update notes
/* 
list.addEventListener("click", e => {
    e.preventDefault();
  
    const id = e.target.parentElement.getAttribute('data-id');
    db.collection("notes").doc(id).update({
        Title: form.note_title.value,
        Notat: form.note.value,
    }).then(()=>{
        console.log("updated");
        Update_Modal.hide();
    }).catch(err => {
        console.log(err)
    })
  })
*/