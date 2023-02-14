type NoteData = {
  id: string;
  title: string;
  description: string;
};

type DraftNoteElements = {
  root: HTMLLIElement;
  addButton: HTMLButtonElement;
  resetButton: HTMLButtonElement;
  titleInput: HTMLInputElement;
  descriptionInput: HTMLTextAreaElement;
};

type NoteElements = {
  root: HTMLLIElement;
  editButton: HTMLButtonElement;
  removeButton: HTMLButtonElement;
  title: HTMLHeadingElement;
  description: HTMLParagraphElement;
};

// Shorter document.querySelector
const dQS = (selector: string) => document.querySelector(selector);
const noteListUL = dQS("ul#note-list") as HTMLUListElement;
const noteTemplate = dQS("template#note") as HTMLTemplateElement;

const draftNoteElements: DraftNoteElements = {
  root: dQS('li[data-id="draft"]') as HTMLLIElement,
  addButton: dQS("button#add") as HTMLButtonElement,
  resetButton: dQS("button#reset") as HTMLButtonElement,
  titleInput: dQS("input#title") as HTMLInputElement,
  descriptionInput: dQS("textarea#description") as HTMLTextAreaElement,
};

const getDraftNoteData = (): NoteData => ({
  id: "draft",
  title: draftNoteElements.titleInput.value,
  description: draftNoteElements.descriptionInput.value,
});

function resetDraftNoteFields() {
  draftNoteElements.titleInput.value = "";
  draftNoteElements.descriptionInput.value = "";
  updateDraftNoteButtons();
}

function updateDraftNoteButtons() {
  const noteData = getDraftNoteData();
  const isEmpty = Boolean(!noteData.title && !noteData.description);
  draftNoteElements.addButton.disabled = isEmpty;
  draftNoteElements.resetButton.disabled = isEmpty;
}

function addNote(note: NoteData) {
  note.id = Date.now().toString();
  const li = noteTemplate.content.firstElementChild?.cloneNode(
    true
  ) as HTMLLIElement;
  const removeBtn = li.querySelector(
    "button.note__remove"
  ) as HTMLButtonElement;
  const editBtn = li.querySelector("button.note__edit") as HTMLButtonElement;

  const titleElem = li.querySelector(".note__title") as HTMLElement;
  const descriptionElem = li.querySelector(".note__description") as HTMLElement;
  li.setAttribute("data-id", note.id);
  removeBtn.setAttribute("data-id", note.id);
  editBtn.setAttribute("data-id", note.id);
  titleElem.innerText = note.title;
  descriptionElem.innerText = note.description;
  removeBtn.addEventListener("click", handleRemoveNoteClick);
  editBtn.addEventListener("click", handleEditNoteClick);
  noteListUL.appendChild(li);

  resetDraftNoteFields();
}

function removeNote(id: string) {
  dQS(`li[data-id="${id}"]`)?.remove();
}

function toggleNoteEditability(id: string) {
  const noteLi = dQS(`li[data-id="${id}"]`);
  const noteTitle = noteLi?.querySelector(".note__title") as HTMLHeadingElement;
  const noteDescription = noteLi?.querySelector(
    ".note__description"
  ) as HTMLParagraphElement;
  const noteEditButton = noteLi?.querySelector(
    ".note__edit"
  ) as HTMLButtonElement;
  console.log("toggle");
  if (noteTitle.contentEditable !== "true") {
    noteTitle.contentEditable = "true";
    noteDescription.contentEditable = "true";
    noteEditButton.innerText = "Done";
    noteTitle.focus();
  } else {
    noteTitle.contentEditable = "false";
    noteDescription.contentEditable = "false";
    noteEditButton.innerText = "Edit";
  }
}

function handleAddNoteClick(e: Event) {
  const note = getDraftNoteData();
  addNote(note);
}

function handleRemoveNoteClick(e: Event) {
  const target = e.target as HTMLButtonElement;
  const id = target.dataset.id;
  if (id) {
    removeNote(id);
  }
}

function handleEditNoteClick(e: Event) {
  const target = e.target as HTMLButtonElement;
  const id = target.dataset.id;
  if (id) {
    toggleNoteEditability(id);
  }
}

draftNoteElements.titleInput.addEventListener("keyup", updateDraftNoteButtons);
draftNoteElements.descriptionInput.addEventListener(
  "keyup",
  updateDraftNoteButtons
);
draftNoteElements.addButton.addEventListener("click", handleAddNoteClick);
draftNoteElements.resetButton.addEventListener("click", resetDraftNoteFields);

updateDraftNoteButtons();

addNote({
  id: "",
  title: "Sample Note",
  description: "This is a note.",
});
