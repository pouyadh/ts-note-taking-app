"use strict";
// Shorter document.querySelector
const dQS = (selector) => document.querySelector(selector);
const noteListUL = dQS("ul#note-list");
const noteTemplate = dQS("template#note");
const draftNoteElements = {
    root: dQS('li[data-id="draft"]'),
    addButton: dQS("button#add"),
    resetButton: dQS("button#reset"),
    titleInput: dQS("input#title"),
    descriptionInput: dQS("textarea#description"),
};
const getDraftNoteData = () => ({
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
function addNote(note) {
    var _a;
    note.id = Date.now().toString();
    const li = (_a = noteTemplate.content.firstElementChild) === null || _a === void 0 ? void 0 : _a.cloneNode(true);
    const removeBtn = li.querySelector("button.note__remove");
    const editBtn = li.querySelector("button.note__edit");
    const titleElem = li.querySelector(".note__title");
    const descriptionElem = li.querySelector(".note__description");
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
function removeNote(id) {
    var _a;
    (_a = dQS(`li[data-id="${id}"]`)) === null || _a === void 0 ? void 0 : _a.remove();
}
function toggleNoteEditability(id) {
    const noteLi = dQS(`li[data-id="${id}"]`);
    const noteTitle = noteLi === null || noteLi === void 0 ? void 0 : noteLi.querySelector(".note__title");
    const noteDescription = noteLi === null || noteLi === void 0 ? void 0 : noteLi.querySelector(".note__description");
    const noteEditButton = noteLi === null || noteLi === void 0 ? void 0 : noteLi.querySelector(".note__edit");
    console.log("toggle");
    if (noteTitle.contentEditable !== "true") {
        noteTitle.contentEditable = "true";
        noteDescription.contentEditable = "true";
        noteEditButton.innerText = "Done";
        noteTitle.focus();
    }
    else {
        noteTitle.contentEditable = "false";
        noteDescription.contentEditable = "false";
        noteEditButton.innerText = "Edit";
    }
}
function handleAddNoteClick(e) {
    const note = getDraftNoteData();
    addNote(note);
}
function handleRemoveNoteClick(e) {
    const target = e.target;
    const id = target.dataset.id;
    if (id) {
        removeNote(id);
    }
}
function handleEditNoteClick(e) {
    const target = e.target;
    const id = target.dataset.id;
    if (id) {
        toggleNoteEditability(id);
    }
}
draftNoteElements.titleInput.addEventListener("keyup", updateDraftNoteButtons);
draftNoteElements.descriptionInput.addEventListener("keyup", updateDraftNoteButtons);
draftNoteElements.addButton.addEventListener("click", handleAddNoteClick);
draftNoteElements.resetButton.addEventListener("click", resetDraftNoteFields);
updateDraftNoteButtons();
addNote({
    id: "",
    title: "Sample Note",
    description: "This is a note.",
});
