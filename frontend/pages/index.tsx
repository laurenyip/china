import React, { useEffect, useState } from 'react';
import { TiltCard } from '../components/TiltCard';
import { TreeCardLayout } from '../components/TreeCardLayout';
import { FlipCard } from '../components/FlipCard';

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

  const [known, setKnown] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  // Search characters in database
  const searchCharacters = async (query: string) => {
    if (!query.trim()) {
      fetchKnown();
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:8000/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error('Failed to search characters');
      const results = await res.json();
      setKnown(results);
    } catch (e) {
      setError('Could not search characters');
    } finally {
      setLoading(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    searchCharacters(query);
  };

  useEffect(() => {
    fetchKnown();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Blue Bar at Top */}
      <div className="header-top-bar"></div>
      
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <h1 className="heading-vogue">character repository</h1>
           
          </div>
          <div className="header-right">
            {/* Search Bar in Header */}
            <div className="header-search">
              <input
                type="text"
                placeholder="Search characters..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <button type="button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
              </button>
            </div>
            <div className="user-actions">
              <button className="icon-button" aria-label="Settings">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97c0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1c0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z"/>
                </svg>
              </button>
              <button className="icon-button" aria-label="Profile">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Search Section */}
        <div className="search-section">
          <div className="main-search-container">
            <input
              type="text"
              placeholder="Search all characters in database..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <button type="button">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
            </button>
          </div>
          {error && <div className="error-message">{error}</div>}
        </div>

        {/* Character Tree Section */}
        <div className="character-tree">
          <h2 className="heading-vogue" style={{marginBottom: '2rem', textAlign: 'center'}}>
            {searchQuery ? `Search Results for "${searchQuery}"` : 'My Known Words'}
          </h2>
          {loading ? (
            <div style={{textAlign: 'center', color: '#666', fontSize: '1.1rem'}}>Searching...</div>
          ) : known.length === 0 ? (
            <div style={{textAlign: 'center', color: '#666', fontSize: '1.1rem'}}>
              {searchQuery ? 'No characters found matching your search.' : 'No words yet. Start adding!'}
            </div>
          ) : (
            <TreeCardLayout
              cards={known.map((word) => (
                <FlipCard
                  key={word.id}
                  character={word.character}
                  pinyin={edits[word.id ?? word.character]?.pinyin ?? word.pinyin}
                  definition={edits[word.id ?? word.character]?.definition ?? word.definition}
                  notes={notes[word.id ?? word.character] || ''}
                  onNoteChange={val => setNotes(prev => ({ ...prev, [word.id ?? word.character]: val }))}
                  onRemove={() => handleRemove(word.id)}
                  learnedDate={word.created_at}
                />
              ))}
            />
          )}
        </div>
      </main>
    </div>
  );
}

