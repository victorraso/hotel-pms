import { useEffect, useState } from 'react';
import Button from '../../../shared/ui/Button';

export default function NotesWidget({ userId }) {
  const [currentNote, setCurrentNote] = useState('');
  const [noteColor, setNoteColor] = useState('bg-yellow-400');
  const [showBlock, setShowBlock] = useState(false);
  const [notes, setNotes] = useState(() => {
    return JSON.parse(localStorage.getItem(`notes-${userId}`)) || [];
  });

  useEffect(() => {
    localStorage.setItem(`notes-${userId}`, JSON.stringify(notes));
  }, [notes, userId]);

  function handleAddNote() {
    if (!currentNote) return;
    const id = crypto.randomUUID();
    const newNote = {
      id,
      message: currentNote,
      color: noteColor,
    };

    setNotes((prev) => [...prev, newNote]);
    setCurrentNote('');
  }

  function handleRemoveNote(id) {
    setNotes(notes.filter((n) => n.id !== id));
  }

  return (
    <div className="">
      <div>
        <div className="flex h-8 w-80 flex-row items-center gap-2">
          <div
            className="flex flex-row items-end gap-3"
            onClick={() => setShowBlock((prev) => !prev)}
          >
            <label className="font-bold">NOTE BLOCK</label>
            <span className="h-6 w-7 cursor-pointer text-xl font-bold">
              {showBlock ? '-' : '+'}
            </span>
          </div>
          {showBlock && (
            <div className="flex flex-1 flex-row items-center justify-around">
              <div className="flex flex-row gap-1">
                <span
                  className="inline-block h-4 w-4 overflow-hidden bg-rose-500"
                  onClick={() => setNoteColor('bg-rose-500')}
                />
                <span
                  className="inline-block h-4 w-4 overflow-hidden bg-cyan-500"
                  onClick={() => setNoteColor('bg-cyan-500')}
                />
                <span
                  className="inline-block h-4 w-4 overflow-hidden bg-yellow-400"
                  onClick={() => setNoteColor('bg-yellow-400')}
                />
                <span
                  className="inline-block h-4 w-4 overflow-hidden bg-lime-500"
                  onClick={() => setNoteColor('bg-lime-500')}
                />
              </div>
              <Button color="blue" onClick={handleAddNote}>
                add
              </Button>
            </div>
          )}
        </div>
        {showBlock && (
          <textarea
            spellCheck={false}
            className={`border-border2 mt-1 h-30 w-80 resize-none rounded-md border text-gray-900 focus:ring-0 focus:outline-none ${noteColor} p-1`}
            value={currentNote}
            onChange={(e) => setCurrentNote(e.target.value)}
          />
        )}
      </div>
      <div className="mt-1 flex flex-row flex-wrap gap-1">
        {notes.map((note) => (
          <div
            key={note.id}
            className={`group relative aspect-square w-25 border text-gray-900 ${note.color} hide-scrollbar overflow-y-auto rounded-md p-1 text-xs`}
          >
            <span
              className="absolute top-0 right-0 cursor-pointer bg-gray-950/70 px-1 text-[12px] font-bold text-gray-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              onClick={() => handleRemoveNote(note.id)}
            >
              x
            </span>
            <span>{note.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
