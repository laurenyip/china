import React, { useEffect, useState } from 'react';
import { TiltCard } from '../components/TiltCard';
import { TreeCardLayout } from '../components/TreeCardLayout';

interface Character {
  id?: number;
  character: string;
  pinyin?: string;
  jyutping?: string;
  definition?: string;
  example?: string;
  stroke_order?: string;
  frequency?: number;
  familiarity?: number;
  created_at?: string;
}

export default function Home() {
  // Remove a word from the repo
  const handleRemove = async (id?: number) => {
    if (!id) return;
    if (!window.confirm('Remove this word from your repo?')) return;
    try {
      const res = await fetch(`http://localhost:8000/characters/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete');
      setKnown(prev => prev.filter(w => w.id !== id));
    } catch (e) {
      alert('Could not remove word.');
    }
  }

  // Notes state: character id -> note string
  const [notes, setNotes] = useState<{ [id: string]: string }>({});
  // Editable fields state: character id -> { pinyin, definition }
  const [edits, setEdits] = useState<{ [id: string]: { pinyin: string; definition: string } }>({});

  // Load notes and edits from localStorage on mount
  useEffect(() => {
    const storedNotes = localStorage.getItem('characterNotes');
    if (storedNotes) setNotes(JSON.parse(storedNotes));
    const storedEdits = localStorage.getItem('characterEdits');
    if (storedEdits) setEdits(JSON.parse(storedEdits));
  }, []);

  // Save notes and edits to localStorage when they change
  useEffect(() => {
    localStorage.setItem('characterNotes', JSON.stringify(notes));
  }, [notes]);
  useEffect(() => {
    localStorage.setItem('characterEdits', JSON.stringify(edits));
  }, [edits]);

  const [suggested, setSuggested] = useState<Character | null>(null);
  const [known, setKnown] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch known words
  const fetchKnown = async () => {
    try {
      const res = await fetch('http://localhost:8000/characters');
      if (!res.ok) throw new Error('Failed to fetch known words');
      setKnown(await res.json());
    } catch (e) {
      setError('Could not load known words');
    }
  };

  // Fetch a suggested word
  const fetchSuggestion = async () => {
    setError(null);
    setSuggested(null);
    try {
      const res = await fetch('http://localhost:8000/suggest');
      if (!res.ok) throw new Error('No new words to suggest!');
      setSuggested(await res.json());
    } catch (e) {
      setError('No new words to suggest!');
    }
  };

  // Add a word to repo
  const addWord = async () => {
    if (!suggested) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:8000/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(suggested),
      });
      if (!res.ok) throw new Error('Failed to add word');
      await fetchKnown();
      await fetchSuggestion();
    } catch (e) {
      setError('Could not add word');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKnown();
    fetchSuggestion();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <h1 className="text-3xl font-bold mb-4 heading-vogue">Chinese Character Repository</h1>
      <div className="w-full max-w-md bg-white rounded shadow p-4 mb-6">
        <h2 className="text-xl font-semibold mb-2 heading-vogue">Suggested Word</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {suggested ? (
          <div className="mb-2">
            <span className="text-2xl font-bold">{suggested.character}</span>
            {suggested.pinyin && <span className="ml-2 text-gray-600">[{suggested.pinyin}]</span>}
            <div className="text-gray-700">{suggested.definition}</div>
          </div>
        ) : (
          <div className="text-gray-500 mb-2">No suggestion available.</div>
        )}
        <div className="flex gap-2">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
            onClick={addWord}
            disabled={!suggested || loading}
          >
            I know this!
          </button>
          <button
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
            onClick={fetchSuggestion}
            disabled={!suggested || loading}
          >
            Don't Know
          </button>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center w-full">
        <h2 className="text-xl font-semibold mb-6 text-white heading-vogue">My Known Words</h2>
        {known.length === 0 ? (
          <div className="text-gray-400">No words yet. Start adding!</div>
        ) : (
          <React.Fragment>
            {/* TreeCardLayout for tree display */}
            <TreeCardLayout
              cards={known.map((word) => (
                <TiltCard
                  key={word.id}
                  character={word.character}
                  pinyin={edits[word.id ?? word.character]?.pinyin ?? word.pinyin}
                  definition={edits[word.id ?? word.character]?.definition ?? word.definition}
                  created_at={word.created_at}
                  note={notes[word.id ?? word.character] || ''}
                  onNoteChange={val => setNotes(prev => ({ ...prev, [word.id ?? word.character]: val }))}
                  onRemove={() => handleRemove(word.id)}
                  editable
                  onPinyinChange={val => setEdits(prev => {
                    const current = prev[word.id ?? word.character] || { pinyin: word.pinyin || '', definition: word.definition || '' };
                    return { ...prev, [word.id ?? word.character]: { pinyin: val, definition: current.definition } };
                  })}
                  onDefinitionChange={val => setEdits(prev => {
                    const current = prev[word.id ?? word.character] || { pinyin: word.pinyin || '', definition: word.definition || '' };
                    return { ...prev, [word.id ?? word.character]: { pinyin: current.pinyin, definition: val } };
                  })}
                />
              ))}
            />
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

