import { notesDummy } from "./notesDummyData.js";
let notes = [...notesDummy];

export function getNotes() { return notes; }
export function addNote(note) { 
  notes.push({ id: Date.now(), ...note }); 
}
export function deleteNote(id) { 
  notes = notes.filter(n => n.id !== id); 
}