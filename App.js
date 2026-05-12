import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('notes');
    saved ? setNotes(JSON.parse(saved)) : setNotes([
      { id: 1, title: 'Welcome!', content: 'Your first note', date: new Date().toLocaleDateString() }
    ]);
  }, []);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return alert('Fill all fields');
    
    if (editId) {
      setNotes(notes.map(n => n.id === editId ? { ...n, title, content, date: new Date().toLocaleDateString() } : n));
      setEditId(null);
    } else {
      setNotes([{ id: Date.now(), title, content, date: new Date().toLocaleDateString() }, ...notes]);
    }
    setTitle('');
    setContent('');
  };

  const deleteNote = (id) => {
    if (window.confirm('Delete?')) setNotes(notes.filter(n => n.id !== id));
  };

  const editNote = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditId(note.id);
  };

  return (
    <div className="app">
      <header>
        <h1>📝 Notes App</h1>
        <p>CRUD Operations in React</p>
      </header>

      <div className="container">
        <div className="form-card">
          <h2>{editId ? '✏️ Edit' : 'Add a note'}</h2>
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <textarea placeholder="Content" rows="4" value={content} onChange={(e) => setContent(e.target.value)}></textarea>
            <div className="form-buttons">
              <button type="submit" className="btn-save">{editId ? 'Update' : 'Save'}</button>
              {editId && <button type="button" className="btn-cancel" onClick={() => { setTitle(''); setContent(''); setEditId(null); }}>Cancel</button>}
            </div>
          </form>
        </div>

        <div className="notes-section">
          <h2>Your Notes ({notes.length})</h2>
          {notes.length === 0 ? (
            <div className="empty-state"><p>📭 No notes</p></div>
          ) : (
            <div className="notes-grid">
              {notes.map(note => (
                <div key={note.id} className="note-card">
                  <div className="note-header">
                    <h3>{note.title}</h3>
                    <div>
                      <button className="btn-edit" onClick={() => editNote(note)}>✏️</button>
                      <button className="btn-delete" onClick={() => deleteNote(note.id)}>🗑️</button>
                    </div>
                  </div>
                  <p>{note.content}</p>
                  <small>📅 {note.date}</small>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <footer><p>Total Notes: {notes.length}</p></footer>
    </div>
  );
}

export default App;
