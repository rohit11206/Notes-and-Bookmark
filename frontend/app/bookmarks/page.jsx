"use client";

import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [tagsFilter, setTagsFilter] = useState("");

  const [form, setForm] = useState({
    id: null,
    url: "",
    title: "",
    description: "",
    tags: "",
    isFavorite: false,
  });
  const [fetchingTitle, setFetchingTitle] = useState(false);

  const loadBookmarks = async () => {
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
      const res = await fetch(
        `${API_BASE}/bookmarks?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Failed to load bookmarks");
      }
      setBookmarks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookmarks();
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
      url: form.url,
      title: form.title || undefined,
      description: form.description || undefined,
      tags: form.tags
        ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [],
      isFavorite: form.isFavorite,
    };
    const isEditing = Boolean(form.id);
    try {
      const res = await fetch(
        `${API_BASE}/bookmarks${isEditing ? `/${form.id}` : ""}`,
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Failed to save bookmark");
      }
      setForm({
        id: null,
        url: "",
        title: "",
        description: "",
        tags: "",
        isFavorite: false,
      });
      await loadBookmarks();
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchTitleFromUrl = async () => {
    const url = form.url?.trim();
    if (!url) {
      setError("Enter a URL first.");
      return;
    }
    const token = getToken();
    if (!token) {
      setError("You must login first.");
      return;
    }
    setError("");
    setFetchingTitle(true);
    try {
      const res = await fetch(
        `${API_BASE}/bookmarks/fetch-title?${new URLSearchParams({ url })}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to fetch title");
      if (data.title) {
        setForm((prev) => ({ ...prev, title: data.title }));
      } else {
        setError("Could not fetch title from this URL.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setFetchingTitle(false);
    }
  };

  const handleEdit = (bookmark) => {
    setForm({
      id: bookmark._id,
      url: bookmark.url,
      title: bookmark.title || "",
      description: bookmark.description || "",
      tags: (bookmark.tags || []).join(", "),
      isFavorite: bookmark.isFavorite || false,
    });
  };

  const handleDelete = async (id) => {
    const token = getToken();
    if (!token) return;
    if (!window.confirm("Delete this bookmark?")) return;
    try {
      const res = await fetch(`${API_BASE}/bookmarks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body?.message || "Failed to delete bookmark");
      }
      await loadBookmarks();
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleFavorite = async (bookmark) => {
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/bookmarks/${bookmark._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isFavorite: !bookmark.isFavorite }),
      });
      const body = await res.json();
      if (!res.ok) {
        throw new Error(body?.message || "Failed to toggle favorite");
      }
      await loadBookmarks();
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
            placeholder="Search text / URL..."
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
          <button
            type="button"
            onClick={loadBookmarks}
            className="btn-primary"
          >
            Apply
          </button>
        </div>
      </section>

      <section className="card">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-stone-500">
          {form.id ? "Edit Bookmark" : "New Bookmark"}
        </h2>
        {error && (
          <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-3 text-sm">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-ink">URL</label>
            <div className="flex gap-2">
              <input
                type="url"
                required
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                placeholder="https://example.com"
                className="input flex-1"
              />
              <button
                type="button"
                onClick={fetchTitleFromUrl}
                disabled={fetchingTitle || !form.url.trim()}
                className="rounded-lg border border-primary-500 bg-white px-3 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {fetchingTitle ? "Fetching…" : "Fetch title"}
              </button>
            </div>
            <p className="text-xs text-stone-500">
              Paste a URL and click &quot;Fetch title&quot; to auto-fill the title from the page.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-ink">
                Title (optional)
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Fetched or type manually"
                className="input"
              />
            </div>
            <div className="space-y-1">
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
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-ink">
              Description (optional)
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="input min-h-[80px] resize-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="inline-flex items-center gap-2 text-sm text-ink">
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
              {form.id ? "Update Bookmark" : "Create Bookmark"}
            </button>
            {form.id && (
              <button
                type="button"
                onClick={() =>
                  setForm({
                    id: null,
                    url: "",
                    title: "",
                    description: "",
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
            Bookmarks
          </h2>
          {loading && (
            <span className="text-xs text-stone-500">
              Loading bookmarks...
            </span>
          )}
        </div>
        {bookmarks.length === 0 && !loading ? (
          <p className="text-sm text-stone-500">
            No bookmarks found. Add one above.
          </p>
        ) : (
          <ul className="grid gap-3 md:grid-cols-2">
            {bookmarks.map((bookmark) => (
              <li
                key={bookmark._id}
                className="flex flex-col justify-between rounded-xl border border-stone-200 bg-white p-4 shadow-card transition-shadow hover:shadow-card-hover"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <a
                      href={bookmark.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-semibold text-primary-600 hover:text-primary-700"
                    >
                      {bookmark.title || bookmark.url}
                    </a>
                    {bookmark.description && (
                      <p className="mt-1 line-clamp-3 text-xs text-stone-600">
                        {bookmark.description}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleFavorite(bookmark)}
                    className={`text-base ${
                      bookmark.isFavorite
                        ? "text-primary-500"
                        : "text-stone-300 hover:text-primary-400"
                    }`}
                  >
                    ★
                  </button>
                </div>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1">
                    {(bookmark.tags || []).map((tag) => (
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
                      onClick={() => handleEdit(bookmark)}
                      className="font-medium text-primary-600 hover:text-primary-700"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(bookmark._id)}
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

