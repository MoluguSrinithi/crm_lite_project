import React from "react";
import NoteList from "./NoteList";
import AddNote from "./AddNote";

const NoteSection = () => {
  return (
    <div>
      <AddNote />
      <NoteList />
    </div>
  );
};

export default NoteSection;
