const express = require('express');
const Note = require('../models/Note');
const auth = require('../middleware/authMiddleware');
const { validateBody, validateQuery, noteSchema, searchQuerySchema } = require('../utils/validation');

const router = express.Router();

// Create note
router.post('/', auth, validateBody(noteSchema), async (req, res, next) => {
  try {
    const note = await Note.create({
      ...req.validatedBody,
      user: req.user._id,
    });
    return res.status(201).json(note);
  } catch (err) {
    return next(err);
  }
});

// List notes with optional search and tags
router.get('/', auth, validateQuery(searchQuerySchema), async (req, res, next) => {
  try {
    const { q, tags } = req.validatedQuery;

    const filter = { user: req.user._id };

    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } },
      ];
    }

    if (tags) {
      const tagArray = tags.split(',').map((t) => t.trim()).filter(Boolean);
      if (tagArray.length > 0) {
        filter.tags = { $in: tagArray };
      }
    }

    const notes = await Note.find(filter).sort({ updatedAt: -1 });
    return res.status(200).json(notes);
  } catch (err) {
    return next(err);
  }
});

// Get note by id
router.get('/:id', auth, async (req, res, next) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user._id });
    if (!note) {
      return res.status(404).json({ error: 'NotFound', message: 'Note not found' });
    }
    return res.status(200).json(note);
  } catch (err) {
    return next(err);
  }
});

// Update note
router.put('/:id', auth, validateBody(noteSchema.partial()), async (req, res, next) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.validatedBody,
      { new: true }
    );

    if (!note) {
      return res.status(404).json({ error: 'NotFound', message: 'Note not found' });
    }

    return res.status(200).json(note);
  } catch (err) {
    return next(err);
  }
});

// Delete note
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const deleted = await Note.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!deleted) {
      return res.status(404).json({ error: 'NotFound', message: 'Note not found' });
    }
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
});

module.exports = router;

