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

  const [form, setForm] = useState({
    id: null,
    title: "",
    content: "",
    tags: "",
    isFavorite: false,
  });

  const loadNotes = async () => {
    const token = getToken();
    if (!token) {
      setError("You must login first.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (search) params.set("q", search);
      if (tagsFilter) params.set("tags", tagsFilter);
      const res = await fetch(`${API_BASE}/notes?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Failed to load notes");
      }
      setNotes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();
    if (!token) {
      setError("You must login first.");
      return;
    }
    setError("");
    const payload = {
      title: form.title,
      content: form.content,
      tags: form.tags
        ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [],
      isFavorite: form.isFavorite,
    };
    const isEditing = Boolean(form.id);
    try {
      const res = await fetch(
        `${API_BASE}/notes${isEditing ? `/${form.id}` : ""}`,
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      const data = isEditing && (await res.json());
      if (!res.ok) {
        const body = !isEditing ? await res.json() : data;
        throw new Error(body?.message || "Failed to save note");
      }
      setForm({
        id: null,
        title: "",
        content: "",
        tags: "",
        isFavorite: false,
      });
      await loadNotes();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (note) => {
    setForm({
      id: note._id,
      title: note.title,
      content: note.content || "",
      tags: (note.tags || []).join(", "),
      isFavorite: note.isFavorite || false,
    });
  };

  const handleDelete = async (id) => {
    const token = getToken();
    if (!token) return;
    if (!window.confirm("Delete this note?")) return;
    try {
      const res = await fetch(`${API_BASE}/notes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body?.message || "Failed to delete note");
      }
      await loadNotes();
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleFavorite = async (note) => {
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/notes/${note._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isFavorite: !note.isFavorite }),
      });
      const body = await res.json();
      if (!res.ok) {
        throw new Error(body?.message || "Failed to toggle favorite");
      }
      await loadNotes();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <section className="card">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-stone-500">
          Search & Filters
        </h2>
        <div className="flex flex-wrap gap-3 text-sm">
          <input
            type="text"
            placeholder="Search text..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input min-w-[180px] flex-1"
          />
          <input
            type="text"
            placeholder="Tags (comma separated)"
            value={tagsFilter}
            onChange={(e) => setTagsFilter(e.target.value)}
            className="input min-w-[180px] flex-1"
          />
          <button type="button" onClick={loadNotes} className="btn-primary">
            Apply
          </button>
        </div>
      </section>

      <section className="card">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-stone-500">
          {form.id ? "Edit Note" : "New Note"}
        </h2>
        {error && (
          <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-3 text-sm">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-ink">Title</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="input"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-ink">Content</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={3}
              className="input min-h-[80px] resize-none"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex-1 space-y-1">
              <label className="block text-sm font-medium text-ink">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                className="input"
              />
            </div>
            <label className="mt-6 inline-flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                checked={form.isFavorite}
                onChange={(e) =>
                  setForm({ ...form, isFavorite: e.target.checked })
                }
                className="h-4 w-4 rounded border-stone-300 text-primary-500 focus:ring-primary-500"
              />
              Mark as favorite
            </label>
          </div>
          <div className="flex items-center gap-2">
            <button type="submit" className="btn-primary">
              {form.id ? "Update Note" : "Create Note"}
            </button>
            {form.id && (
              <button
                type="button"
                onClick={() =>
                  setForm({
                    id: null,
                    title: "",
                    content: "",
                    tags: "",
                    isFavorite: false,
                  })
                }
                className="text-sm text-stone-500 hover:text-ink"
              >
                Cancel edit
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="card">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
            Notes
          </h2>
          {loading && (
            <span className="text-xs text-stone-500">Loading notes...</span>
          )}
        </div>
        {notes.length === 0 && !loading ? (
          <p className="text-sm text-stone-500">
            No notes found. Create your first note above.
          </p>
        ) : (
          <ul className="grid gap-3 md:grid-cols-2">
            {notes.map((note) => (
              <li
                key={note._id}
                className="flex flex-col justify-between rounded-xl border border-stone-200 bg-white p-4 shadow-card transition-shadow hover:shadow-card-hover"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-semibold text-ink">
                      {note.title}
                    </h3>
                    {note.content && (
                      <p className="mt-1 line-clamp-3 text-xs text-stone-600">
                        {note.content}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleFavorite(note)}
                    className={`text-base ${
                      note.isFavorite
                        ? "text-primary-500"
                        : "text-stone-300 hover:text-primary-400"
                    }`}
                  >
                    ★
                  </button>
                </div>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1">
                    {(note.tags || []).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-primary-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-primary-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => handleEdit(note)}
                      className="font-medium text-primary-600 hover:text-primary-700"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(note._id)}
                      className="font-medium text-red-600 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

