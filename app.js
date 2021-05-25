class App {
  constructor() {
    this.notes = [];
    this.title = '';
    this.text = '';
    this.label = '';
    this.color = '';
    this.id = '';
    this.sort = '';

    this.$loginButton = document.querySelector('#login-button');
    this.$placeholder = document.querySelector('#placeholder');
    this.$form = document.querySelector('#form');
    this.$notes = document.querySelector('#notes');
    this.$noteTitle = document.querySelector('#note-title');
    this.$noteText = document.querySelector('#note-text');
    this.$noteColor = document.querySelector('#note-color');
    this.$noteLabel = document.querySelector('#note-label');
    this.$noteSort = document.querySelector('#note-sort');
    this.$formButtons = document.querySelector('#form-buttons');
    this.$formCloseButton = document.querySelector('#form-close-button');
    this.$modal = document.querySelector('.modal');
    this.$modalTitle = document.querySelector('.modal-title');
    this.$modalText = document.querySelector('.modal-text');
    this.$modalCloseButton = document.querySelector('.modal-close-button');

    this.addEventListeners();
  }

  addEventListeners() {
    document.body.addEventListener('click', (event) => {
      this.handleFormClick(event);
      this.selectNote(event);
    });

    this.$form.addEventListener('submit', (event) => {
      event.preventDefault();
      const title = this.$noteTitle.value;
      const text = this.$noteText.value;
      const label = this.$noteLabel.value;
      const color = this.$noteColor.value;
      const hasNote = label && (title || text);
      if (hasNote) {
        // add note
        this.addNote({title, text, label});
      }
    });

    this.$formCloseButton.addEventListener('click', (event) => {
      event.stopPropagation();
      this.closeForm();
    });

    this.$loginButton.addEventListener('click', (event) => {
      const value = document.querySelector('#user-name-input').value;

      fetch('examples/example.json')
        .then(function (response) {
          // Do stuff with the response
        })
        .catch(function (error) {
          console.log('Looks like there was a problem: \n', error);
        });

      document.querySelector('#user-name').innerHTML = `signed as ${value}`;
      document.querySelector('#user-name-input').style.display = 'none';
      this.$loginButton.style.display = 'none';
    });

    this.$modalCloseButton.addEventListener('click', (event) => {
      event.stopPropagation();
      this.closeModal(event);
    });

    this.$noteSort.addEventListener('blur', (event) => {
      event.stopPropagation();
      this.sort = this.$noteSort.value;
      this.displayNotes();
    });
  }

  handleFormClick(event) {
    const isFormClicked = this.$form.contains(event.target);

    if (isFormClicked) {
      this.openForm();
    } else {
      this.closeForm();
    }
  }

  openForm() {
    this.$form.classList.add('form-open');
    this.$noteTitle.style.display = 'block';
    this.$noteColor.style.display = 'block';
    this.$noteLabel.style.display = 'block';
    this.$formButtons.style.display = 'block';
  }

  closeForm() {
    this.$form.classList.remove('form-open');
    this.$noteTitle.style.display = 'none';
    this.$formButtons.style.display = 'none';
    this.$noteColor.style.display = 'none';
    this.$noteLabel.style.display = 'none';
    this.$noteTitle.value = '';
    this.$noteText.value = '';
    this.$noteColor.value = '';
    this.$noteLabel.value = '';
  }

  openModal(event) {
    if (event.target.closest('.note')) {
      this.$modal.classList.toggle('open-modal');
      this.$modalTitle.value = this.title;
      this.$modalText.value = this.text;
    }
  }

  closeModal(event) {
    this.editNote();
    this.$modal.classList.toggle('open-modal');
  }

  addNote({title, text, label, color}) {
    const newNote = {
      title,
      text,
      label,
      color: color || 'white',
      id: this.notes.length > 0 ? this.notes[this.notes.length - 1].id + 1 : 1,
    };
    this.notes = [...this.notes, newNote];
    this.$noteSort.value = '';
    this.sort = '';
    this.displayNotes();
    this.closeForm();
  }

  editNote() {
    const title = this.$modalTitle.value;
    const text = this.$modalText.value;
    this.notes = this.notes.map((note) =>
      note.id === Number(this.id) ? {...note, title, text} : note
    );
    this.displayNotes();
  }

  selectNote(event) {
    const $selectedNote = event.target.closest('.note');
    if (!$selectedNote) return;
    const [$noteTitle, $noteText] = $selectedNote.children;
    this.title = $noteTitle.innerText;
    this.text = $noteText.innerText;
    this.id = $selectedNote.dataset.id;
    if (event.target.id == 'close-button') {
      this.deleteNote();
    } else {
      this.openModal(event);
    }
  }

  deleteNote() {
    this.notes = this.notes.filter((note) => note.id != this.id);
    this.displayNotes();
  }

  displayNotes() {
    const hasNotes = this.notes.length > 0;
    this.$placeholder.style.display = hasNotes ? 'none' : 'flex';

    const selectedNotes = this.sort
      ? this.notes.filter((note) => note.label == this.sort)
      : this.notes;
    this.$notes.innerHTML = selectedNotes
      .map(
        (note) => `
        <div style="background: ${note.color};" class="note" data-id="${
          note.id
        }">
          <div class="${note.title && 'note-title'}">${note.title}</div>
          <div class="note-te xt">${note.text}</div>
          <div class="note-text">label : ${note.label}</div>
          <button type="button" id="close-button">Close</button> 
          <div class="toolbar-container">
            <div class="toolbar">
            </div>
          </div>
        </div>
     `
      )
      .join('');
  }
}

new App();
