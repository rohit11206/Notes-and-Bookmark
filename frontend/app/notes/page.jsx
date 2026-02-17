"use client";

import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [tagsFilter, setTagsFilter] = useState("");
  const [form, setForm] = useState({ id: null, title: "", content: "", tags: "", isFavorite: false });

  const loadNotes = async () => {
    const token = getToken();
    if (!token) { setError("You must login first."); setLoading(false); return; }
    setLoading(true); setError("");
    try {
      const params = new URLSearchParams();
      if (search) params.set("q", search);
      if (tagsFilter) params.set("tags", tagsFilter);
      const res = await fetch(`${API_BASE}/notes?${params.toString()}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to load notes");
      setNotes(data);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadNotes(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();
    if (!token) { setError("You must login first."); return; }
    setError("");
    const payload = {
      title: form.title, content: form.content,
      tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      isFavorite: form.isFavorite,
    };
    const isEditing = Boolean(form.id);
    try {
      const res = await fetch(`${API_BASE}/notes${isEditing ? `/${form.id}` : ""}`, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = isEditing && (await res.json());
      if (!res.ok) { const body = !isEditing ? await res.json() : data; throw new Error(body?.message || "Failed to save note"); }
      setForm({ id: null, title: "", content: "", tags: "", isFavorite: false });
      await loadNotes();
    } catch (err) { setError(err.message); }
  };

  const handleEdit = (note) => {
    setForm({ id: note._id, title: note.title, content: note.content || "", tags: (note.tags || []).join(", "), isFavorite: note.isFavorite || false });
  };

  const handleDelete = async (id) => {
    const token = getToken();
    if (!token || !window.confirm("Delete this note?")) return;
    try {
      const res = await fetch(`${API_BASE}/notes/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) { const body = await res.json(); throw new Error(body?.message || "Failed to delete note"); }
      await loadNotes();
    } catch (err) { setError(err.message); }
  };

  const toggleFavorite = async (note) => {
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/notes/${note._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ isFavorite: !note.isFavorite }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.message || "Failed to toggle favorite");
      await loadNotes();
    } catch (err) { setError(err.message); }
  };

  return (
    <div className="-mx-4 sm:-mx-6 -mt-8">
      <div className="bg-white border-b border-stone-200 px-4 sm:px-6 py-4">
        <div className="mx-auto max-w-6xl flex flex-wrap gap-3 items-center">
          <input type="text" placeholder="Search notes..." value={search} onChange={(e) => setSearch(e.target.value)} className="input flex-1 min-w-[180px]" />
          <input type="text" placeholder="Filter by tags..." value={tagsFilter} onChange={(e) => setTagsFilter(e.target.value)} className="input flex-1 min-w-[180px]" />
          <button onClick={loadNotes} className="btn-primary">Search</button>
        </div>
      </div>

      <div className="bg-stone-50 border-b border-stone-200 px-4 sm:px-6 py-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-lg font-semibold text-ink mb-4">{form.id ? "Edit Note" : "Create New Note"}</h2>
          {error && <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Title *</label>
                <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input" placeholder="Enter note title" />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Tags (comma separated)</label>
                <input type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="input" placeholder="work, personal, ideas" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Content</label>
              <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={4} className="input" placeholder="Write your note here..." />
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-ink">
                <input type="checkbox" checked={form.isFavorite} onChange={(e) => setForm({ ...form, isFavorite: e.target.checked })} className="h-4 w-4 rounded border-stone-300 text-primary-500 focus:ring-primary-500" />
                Mark as favorite
              </label>
              <div className="ml-auto flex gap-2">
                <button type="submit" className="btn-primary">{form.id ? "Update Note" : "Create Note"}</button>
                {form.id && (
                  <button type="button" onClick={() => setForm({ id: null, title: "", content: "", tags: "", isFavorite: false })} className="rounded-lg border-2 border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-50">
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-ink">My Notes {notes.length > 0 && `(${notes.length})`}</h2>
            {loading && <span className="text-sm text-stone-500">Loading...</span>}
          </div>
          {notes.length === 0 && !loading ? (
            <div className="text-center py-16 rounded-xl border-2 border-dashed border-stone-300">
              <svg className="mx-auto h-12 w-12 text-stone-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-stone-500 font-medium">No notes yet</p>
              <p className="text-stone-400 text-sm mt-1">Create your first note above</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {notes.map((note) => (
                <div key={note._id} className="relative flex flex-col rounded-xl border border-stone-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                  <button type="button" onClick={() => toggleFavorite(note)} className={`absolute right-3 top-3 text-xl ${note.isFavorite ? "text-primary-500" : "text-stone-300 hover:text-primary-400"}`}>
                    ★
                  </button>
                  <div className="mb-3 pr-6">
                    <h3 className="font-semibold text-ink line-clamp-2">{note.title}</h3>
                    {note.content && <p className="mt-1 text-sm text-stone-600 line-clamp-3">{note.content}</p>}
                  </div>
                  {note.tags && note.tags.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-1">
                      {note.tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700">{tag}</span>
                      ))}
                    </div>
                  )}
                  <div className="mt-auto flex gap-2 pt-3 border-t border-stone-100">
                    <button type="button" onClick={() => handleEdit(note)} className="flex-1 rounded-lg bg-stone-100 py-1.5 text-xs font-medium text-ink hover:bg-stone-200">Edit</button>
                    <button type="button" onClick={() => handleDelete(note._id)} className="flex-1 rounded-lg bg-red-50 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
