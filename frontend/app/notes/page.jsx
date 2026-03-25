"use client";
import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

// ─── Simple Markdown Renderer ───────────────────────────────────────────────
function inlineFormat(text, keyBase) {
  const parts = [];
  let remaining = text;
  let key = 0;

  while (remaining) {
    const boldMatch   = remaining.match(/\*\*(.+?)\*\*/);
    const italicMatch = remaining.match(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/);
    const codeMatch   = remaining.match(/`(.+?)`/);

    const candidates = [boldMatch, italicMatch, codeMatch].filter(Boolean);
    if (candidates.length === 0) {
      parts.push(<span key={`${keyBase}-${key++}`}>{remaining}</span>);
      break;
    }

    const first = candidates.reduce((min, m) => (m.index < min.index ? m : min));

    if (first.index > 0) {
      parts.push(<span key={`${keyBase}-${key++}`}>{remaining.slice(0, first.index)}</span>);
    }

    if (first === boldMatch) {
      parts.push(<strong key={`${keyBase}-${key++}`} className="font-bold text-ink">{first[1]}</strong>);
    } else if (first === italicMatch) {
      parts.push(<em key={`${keyBase}-${key++}`} className="italic">{first[1]}</em>);
    } else if (first === codeMatch) {
      parts.push(
        <code key={`${keyBase}-${key++}`} className="bg-stone-100 border border-stone-200 px-1.5 py-0.5 rounded font-mono text-sm text-rose-600">
          {first[1]}
        </code>
      );
    }
    remaining = remaining.slice(first.index + first[0].length);
  }
  return parts;
}

function renderMarkdown(text) {
  if (!text) return null;
  const lines = text.split("\n");
  const elements = [];

  lines.forEach((line, i) => {
    if (line.startsWith("### ")) {
      elements.push(<h3 key={i} className="text-base font-bold text-ink mt-4 mb-1">{inlineFormat(line.slice(4), i)}</h3>);
    } else if (line.startsWith("## ")) {
      elements.push(<h2 key={i} className="text-lg font-bold text-ink mt-5 mb-1.5">{inlineFormat(line.slice(3), i)}</h2>);
    } else if (line.startsWith("# ")) {
      elements.push(<h1 key={i} className="text-xl font-extrabold text-ink mt-6 mb-2">{inlineFormat(line.slice(2), i)}</h1>);
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      elements.push(
        <div key={i} className="flex gap-2 text-stone-700 my-0.5">
          <span className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary-400" />
          <span>{inlineFormat(line.slice(2), i)}</span>
        </div>
      );
    } else if (line.startsWith("> ")) {
      elements.push(
        <blockquote key={i} className="border-l-4 border-primary-300 pl-4 my-2 text-stone-600 italic bg-primary-50/40 py-1 rounded-r">
          {inlineFormat(line.slice(2), i)}
        </blockquote>
      );
    } else if (line === "") {
      elements.push(<div key={i} className="h-2" />);
    } else {
      elements.push(
        <p key={i} className="text-stone-700 leading-relaxed">
          {inlineFormat(line, i)}
        </p>
      );
    }
  });

  return elements;
}

// ─── Note Color Palette ──────────────────────────────────────────────────────
const NOTE_COLORS = [
  { name: "White",  value: "",        card: "bg-white border-stone-200",          dot: "bg-white border-stone-400"    },
  { name: "Yellow", value: "yellow",  card: "bg-yellow-50 border-yellow-200",     dot: "bg-yellow-200 border-yellow-400" },
  { name: "Blue",   value: "blue",    card: "bg-blue-50 border-blue-200",         dot: "bg-blue-200 border-blue-400"  },
  { name: "Green",  value: "green",   card: "bg-green-50 border-green-200",       dot: "bg-green-200 border-green-400" },
  { name: "Pink",   value: "pink",    card: "bg-pink-50 border-pink-200",         dot: "bg-pink-200 border-pink-400"  },
  { name: "Purple", value: "purple",  card: "bg-purple-50 border-purple-200",     dot: "bg-purple-200 border-purple-400" },
];

function getColorClasses(color) {
  return NOTE_COLORS.find((c) => c.value === color) ?? NOTE_COLORS[0];
}

// ─── Formatting Toolbar ──────────────────────────────────────────────────────
function FormatBar({ form, setForm }) {
  const insertAround = (prefix, suffix = "") => {
    const el = document.getElementById("note-content-ta");
    if (!el) return;
    const s = el.selectionStart, e = el.selectionEnd;
    const sel = form.content.slice(s, e);
    const next = form.content.slice(0, s) + prefix + sel + suffix + form.content.slice(e);
    setForm({ ...form, content: next });
    setTimeout(() => { el.focus(); el.setSelectionRange(s + prefix.length, e + prefix.length); }, 0);
  };

  const insertLinePrefix = (prefix) => {
    const el = document.getElementById("note-content-ta");
    if (!el) return;
    const s = el.selectionStart;
    const before = form.content.slice(0, s);
    const lineStart = before.lastIndexOf("\n") + 1;
    const next = form.content.slice(0, lineStart) + prefix + form.content.slice(lineStart);
    setForm({ ...form, content: next });
    setTimeout(() => el.focus(), 0);
  };

  const btn = "px-2.5 py-1 text-xs rounded-md hover:bg-white hover:shadow-sm transition-all text-stone-600 font-medium border border-transparent hover:border-stone-200 select-none";
  const sep = <span className="w-px h-4 bg-stone-300 mx-0.5 self-center" />;

  return (
    <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 bg-stone-100 border border-b-0 border-stone-300 rounded-t-lg">
      <button type="button" className={btn} onClick={() => insertLinePrefix("# ")}>H1</button>
      <button type="button" className={`${btn} text-[11px]`} onClick={() => insertLinePrefix("## ")}>H2</button>
      <button type="button" className={`${btn} text-[10px]`} onClick={() => insertLinePrefix("### ")}>H3</button>
      {sep}
      <button type="button" className={`${btn} font-bold`} onClick={() => insertAround("**", "**")}>B</button>
      <button type="button" className={`${btn} italic`} onClick={() => insertAround("*", "*")}>I</button>
      <button type="button" className={`${btn} font-mono text-[11px]`} onClick={() => insertAround("`", "`")}>&lt;/&gt;</button>
      {sep}
      <button type="button" className={btn} onClick={() => insertLinePrefix("- ")}>• List</button>
      <button type="button" className={btn} onClick={() => insertLinePrefix("> ")}>❝ Quote</button>
    </div>
  );
}

// ─── Note Modal ──────────────────────────────────────────────────────────────
function NoteModal({ note, onClose, onEdit, onDelete, onToggleFavorite }) {
  const cs = getColorClasses(note.color);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal Card */}
      <div
        className={`relative z-10 w-full max-w-2xl flex flex-col rounded-2xl border-2 ${cs.card} shadow-2xl`}
        style={{ maxHeight: "85vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start gap-4 px-6 py-4 border-b border-stone-200">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-ink leading-snug break-words">{note.title}</h2>
            <div className="flex flex-wrap items-center gap-3 mt-1">
              {note.createdAt && (
                <span className="text-xs text-stone-400">
                  {new Date(note.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              )}
              {note.isFavorite && (
                <span className="text-xs text-amber-500 font-semibold">★ Favorite</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Favorite toggle in modal */}
            <button
              type="button"
              title={note.isFavorite ? "Remove from favorites" : "Add to favorites"}
              onClick={() => onToggleFavorite(note)}
              className={`w-8 h-8 flex items-center justify-center rounded-full text-lg transition-colors ${
                note.isFavorite ? "text-amber-400 hover:text-amber-500" : "text-stone-300 hover:text-amber-300"
              }`}
            >
              ★
            </button>
            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 transition-colors text-base font-bold"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <div className="px-6 pt-3 flex flex-wrap gap-1.5">
            {note.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-primary-50 border border-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-700">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Content — scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {note.content ? (
            <div className="space-y-0.5">{renderMarkdown(note.content)}</div>
          ) : (
            <p className="text-stone-400 italic text-sm">No content written yet.</p>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex gap-2 px-6 py-4 border-t border-stone-200">
          <button
            type="button"
            onClick={() => onEdit(note)}
            className="flex-1 rounded-lg bg-stone-100 py-2 text-sm font-medium text-ink hover:bg-stone-200 transition-colors"
          >
            ✏️ Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(note._id)}
            className="flex-1 rounded-lg bg-red-50 py-2 text-sm font-medium text-red-600 hover:bg-red-100 transition-colors"
          >
            🗑 Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function NotesPage() {
  const [notes, setNotes]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [search, setSearch]       = useState("");
  const [tagsFilter, setTagsFilter] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);
  const [form, setForm] = useState({
    id: null, title: "", content: "", tags: "", isFavorite: false, color: "",
  });

  const loadNotes = async () => {
    const token = getToken();
    if (!token) { setError("You must login first."); setLoading(false); return; }
    setLoading(true); setError("");
    try {
      const params = new URLSearchParams();
      if (search) params.set("q", search);
      if (tagsFilter) params.set("tags", tagsFilter);
      const res  = await fetch(`${API_BASE}/notes?${params}`, { headers: { Authorization: `Bearer ${token}` } });
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
      title: form.title,
      content: form.content,
      tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      isFavorite: form.isFavorite,
      color: form.color,
    };
    const isEditing = Boolean(form.id);
    try {
      const res  = await fetch(`${API_BASE}/notes${isEditing ? `/${form.id}` : ""}`, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = isEditing && (await res.json());
      if (!res.ok) {
        const body = !isEditing ? await res.json() : data;
        throw new Error(body?.message || "Failed to save note");
      }
      setForm({ id: null, title: "", content: "", tags: "", isFavorite: false, color: "" });
      await loadNotes();
    } catch (err) { setError(err.message); }
  };

  const handleEdit = (note) => {
    setSelectedNote(null);
    setForm({
      id: note._id,
      title: note.title,
      content: note.content || "",
      tags: (note.tags || []).join(", "),
      isFavorite: note.isFavorite || false,
      color: note.color || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const token = getToken();
    if (!token || !window.confirm("Delete this note?")) return;
    try {
      const res = await fetch(`${API_BASE}/notes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) { const body = await res.json(); throw new Error(body?.message || "Failed to delete note"); }
      setSelectedNote(null);
      await loadNotes();
    } catch (err) { setError(err.message); }
  };

  const toggleFavorite = async (note) => {
    const token = getToken();
    if (!token) return;
    try {
      const res  = await fetch(`${API_BASE}/notes/${note._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ isFavorite: !note.isFavorite }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.message || "Failed to toggle favorite");
      // Keep modal in sync
      if (selectedNote?._id === note._id) {
        setSelectedNote({ ...selectedNote, isFavorite: !note.isFavorite });
      }
      await loadNotes();
    } catch (err) { setError(err.message); }
  };

  return (
    <div className="-mx-4 sm:-mx-6 -mt-8">
      {/* ── Search Bar ── */}
      <div className="bg-white border-b border-stone-200 px-4 sm:px-6 py-4">
        <div className="mx-auto max-w-6xl flex flex-wrap gap-3 items-center">
          <input
            type="text" placeholder="Search notes..." value={search}
            onChange={(e) => setSearch(e.target.value)} className="input flex-1 min-w-[180px]"
          />
          <input
            type="text" placeholder="Filter by tags..." value={tagsFilter}
            onChange={(e) => setTagsFilter(e.target.value)} className="input flex-1 min-w-[180px]"
          />
          <button onClick={loadNotes} className="btn-primary">Search</button>
        </div>
      </div>

      {/* ── Create / Edit Form ── */}
      <div className="bg-stone-50 border-b border-stone-200 px-4 sm:px-6 py-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-lg font-semibold text-ink mb-4">
            {form.id ? "Edit Note" : "Create New Note"}
          </h2>
          {error && <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Title *</label>
                <input
                  type="text" required value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="input" placeholder="Enter note title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Tags (comma separated)</label>
                <input
                  type="text" value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  className="input" placeholder="work, personal, ideas"
                />
              </div>
            </div>

            {/* ── Color Picker ── */}
            <div>
              <label className="block text-sm font-medium text-ink mb-2">Note Color</label>
              <div className="flex gap-2 flex-wrap items-center">
                {NOTE_COLORS.map((c) => (
                  <button
                    key={c.value} type="button" title={c.name}
                    onClick={() => setForm({ ...form, color: c.value })}
                    className={`w-6 h-6 rounded-full border-2 transition-all ${c.dot} ${
                      form.color === c.value
                        ? "scale-125 ring-2 ring-offset-1 ring-primary-400 shadow"
                        : "hover:scale-110"
                    }`}
                  />
                ))}
                <span className="text-xs text-stone-400 ml-1">
                  {NOTE_COLORS.find((c) => c.value === form.color)?.name ?? "White"}
                </span>
              </div>
            </div>

            {/* ── Content + Toolbar ── */}
            <div>
              <label className="block text-sm font-medium text-ink mb-1">
                Content{" "}
                <span className="text-xs font-normal text-stone-400">
                  — supports Markdown: # H1, ## H2, **bold**, *italic*, `code`, - list, &gt; quote
                </span>
              </label>
              <FormatBar form={form} setForm={setForm} />
              <textarea
                id="note-content-ta"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={5}
                className="input rounded-t-none font-mono text-sm"
                placeholder={"# Heading\n\nWrite your note here...\n- Use **bold**, *italic*\n- Or bullet lists like this"}
              />
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-ink">
                <input
                  type="checkbox" checked={form.isFavorite}
                  onChange={(e) => setForm({ ...form, isFavorite: e.target.checked })}
                  className="h-4 w-4 rounded border-stone-300 text-primary-500 focus:ring-primary-500"
                />
                Mark as favorite
              </label>
              <div className="ml-auto flex gap-2">
                <button type="submit" className="btn-primary">
                  {form.id ? "Update Note" : "Create Note"}
                </button>
                {form.id && (
                  <button
                    type="button"
                    onClick={() => setForm({ id: null, title: "", content: "", tags: "", isFavorite: false, color: "" })}
                    className="rounded-lg border-2 border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-50"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* ── Notes Grid ── */}
      <div className="px-4 sm:px-6 py-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-ink">
              My Notes {notes.length > 0 && `(${notes.length})`}
            </h2>
            {loading && <span className="text-sm text-stone-500">Loading...</span>}
          </div>

          {notes.length === 0 && !loading ? (
            <div className="text-center py-16 rounded-xl border-2 border-dashed border-stone-300">
              <svg className="mx-auto h-12 w-12 text-stone-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-stone-500 font-medium">No notes yet</p>
              <p className="text-stone-400 text-sm mt-1">Create your first note above</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {notes.map((note) => {
                const cs = getColorClasses(note.color);
                return (
                  <div
                    key={note._id}
                    className={`relative flex flex-col rounded-xl border ${cs.card} p-4 shadow-sm hover:shadow-md transition-all cursor-pointer group`}
                    onClick={() => setSelectedNote(note)}
                  >
                    {/* Favorite star */}
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(note); }}
                      className={`absolute right-3 top-3 text-xl z-10 transition-colors ${
                        note.isFavorite ? "text-amber-400" : "text-stone-300 hover:text-amber-300"
                      }`}
                    >
                      ★
                    </button>

                    {/* Content preview */}
                    <div className="mb-3 pr-6">
                      <h3 className="font-semibold text-ink line-clamp-2">{note.title}</h3>
                      {note.content && (
                        <p className="mt-1 text-sm text-stone-500 line-clamp-3 font-mono">
                          {note.content}
                        </p>
                      )}
                    </div>

                    {/* Tags */}
                    {note.tags && note.tags.length > 0 && (
                      <div className="mb-3 flex flex-wrap gap-1">
                        {note.tags.map((tag) => (
                          <span key={tag} className="rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Action buttons — stop click propagation so they don't open modal */}
                    <div
                      className="mt-auto flex gap-2 pt-3 border-t border-black/5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button" onClick={() => handleEdit(note)}
                        className="flex-1 rounded-lg bg-white/70 py-1.5 text-xs font-medium text-ink hover:bg-white transition-colors border border-stone-200"
                      >
                        Edit
                      </button>
                      <button
                        type="button" onClick={() => handleDelete(note._id)}
                        className="flex-1 rounded-lg bg-red-50 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 transition-colors"
                      >
                        Delete
                      </button>
                    </div>

                    {/* Hover ring */}
                    <div className="absolute inset-0 rounded-xl ring-2 ring-primary-400 ring-offset-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Note Modal ── */}
      {selectedNote && (
        <NoteModal
          note={selectedNote}
          onClose={() => setSelectedNote(null)}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleFavorite={toggleFavorite}
        />
      )}
    </div>
  );
}
