const express = require('express');
const fetch = require('node-fetch');

const Bookmark = require('../models/Bookmark');
const auth = require('../middleware/authMiddleware');
const { validateBody, validateQuery, bookmarkSchema, searchQuerySchema, fetchTitleQuerySchema } = require('../utils/validation');

const router = express.Router();

// Normalize hostname for comparison (strip optional www)
const getHostname = (urlString) => {
  try {
    const u = new URL(urlString);
    const host = (u.hostname || '').toLowerCase();
    return host.startsWith('www.') ? host.slice(4) : host;
  } catch {
    return '';
  }
};

// Derive a friendly site name from the bookmark URL (e.g. chatgpt.com -> "ChatGPT")
const getSiteNameFromUrl = (urlString) => {
  const host = getHostname(urlString);
  if (!host) return '';
  const parts = host.split('.');
  const main = parts.length >= 2 ? parts[parts.length - 2] : parts[0];
  const name = main.replace(/-/g, ' ');
  return name.replace(/\b\w/g, (c) => c.toUpperCase()).slice(0, 255);
};

// Helper to fetch title from URL; on redirect/captcha/login or no title, returns site name from bookmark URL
const fetchTitleFromUrl = async (url) => {
  const requestedHost = getHostname(url);
  const fallbackTitle = getSiteNameFromUrl(url);
  if (!requestedHost) return fallbackTitle;
  try {
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      timeout: 8000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });
    const finalUrl = response.url || url;
    const responseHost = getHostname(finalUrl);
    if (responseHost !== requestedHost) return fallbackTitle;
    const html = await response.text();
    let match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    if (match && match[1]) {
      const raw = match[1].replace(/\s+/g, ' ').trim();
      const decoded = raw
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, ' ');
      return decoded.slice(0, 255);
    }
    match = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i) || html.match(/content=["']([^"']+)["'][^>]+property=["']og:title["']/i);
    if (match && match[1]) return match[1].trim().slice(0, 255);
    return fallbackTitle;
  } catch (err) {
    return fallbackTitle;
  }
};

// Fetch page title from URL (for auto-fill)
router.get('/fetch-title', auth, validateQuery(fetchTitleQuerySchema), async (req, res, next) => {
  try {
    const title = await fetchTitleFromUrl(req.validatedQuery.url);
    return res.status(200).json({ title: title || '' });
  } catch (err) {
    return next(err);
  }
});

// Create bookmark
router.post('/', auth, validateBody(bookmarkSchema), async (req, res, next) => {
  try {
    const data = { ...req.validatedBody };

    // Bonus: auto-fetch title when missing
    if (!data.title) {
      const fetchedTitle = await fetchTitleFromUrl(data.url);
      if (fetchedTitle) {
        data.title = fetchedTitle;
      }
    }

    const bookmark = await Bookmark.create({
      ...data,
      user: req.user._id,
    });
    return res.status(201).json(bookmark);
  } catch (err) {
    return next(err);
  }
});

// List bookmarks with optional search and tags
router.get('/', auth, validateQuery(searchQuerySchema), async (req, res, next) => {
  try {
    const { q, tags } = req.validatedQuery;

    const filter = { user: req.user._id };

    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { url: { $regex: q, $options: 'i' } },
      ];
    }

    if (tags) {
      const tagArray = tags.split(',').map((t) => t.trim()).filter(Boolean);
      if (tagArray.length > 0) {
        filter.tags = { $in: tagArray };
      }
    }

    const bookmarks = await Bookmark.find(filter).sort({ updatedAt: -1 });
    return res.status(200).json(bookmarks);
  } catch (err) {
    return next(err);
  }
});

// Get bookmark by id
router.get('/:id', auth, async (req, res, next) => {
  try {
    const bookmark = await Bookmark.findOne({ _id: req.params.id, user: req.user._id });
    if (!bookmark) {
      return res.status(404).json({ error: 'NotFound', message: 'Bookmark not found' });
    }
    return res.status(200).json(bookmark);
  } catch (err) {
    return next(err);
  }
});

// Update bookmark
router.put('/:id', auth, validateBody(bookmarkSchema.partial()), async (req, res, next) => {
  try {
    const bookmark = await Bookmark.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.validatedBody,
      { new: true }
    );

    if (!bookmark) {
      return res.status(404).json({ error: 'NotFound', message: 'Bookmark not found' });
    }

    return res.status(200).json(bookmark);
  } catch (err) {
    return next(err);
  }
});

// Delete bookmark
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const deleted = await Bookmark.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!deleted) {
      return res.status(404).json({ error: 'NotFound', message: 'Bookmark not found' });
    }
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
});

module.exports = router;

