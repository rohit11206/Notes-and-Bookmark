const { z } = require('zod');

const registerSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(128),
  name: z.string().min(1).max(100).optional(),
});

const loginSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(128),
});

const noteSchema = z.object({
  title: z.string().min(1).max(255),
  content: z.string().max(5000).optional().default(''),
  tags: z.array(z.string().max(50)).optional().default([]),
  isFavorite: z.boolean().optional().default(false),
});

const bookmarkSchema = z.object({
  url: z.string().url().max(2048),
  title: z.string().max(255).optional(),
  description: z.string().max(1000).optional(),
  tags: z.array(z.string().max(50)).optional().default([]),
  isFavorite: z.boolean().optional().default(false),
});

const searchQuerySchema = z.object({
  q: z.string().max(255).optional(),
  tags: z.string().optional(),
});

const fetchTitleQuerySchema = z.object({
  url: z.string().url().max(2048),
});

const validateBody = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse(req.body);
    req.validatedBody = parsed;
    return next();
  } catch (err) {
    return res.status(400).json({
      error: 'ValidationError',
      message: 'Invalid request body',
      details: err.errors,
    });
  }
};

const validateQuery = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse(req.query);
    req.validatedQuery = parsed;
    return next();
  } catch (err) {
    return res.status(400).json({
      error: 'ValidationError',
      message: 'Invalid query parameters',
      details: err.errors,
    });
  }
};

module.exports = {
  registerSchema,
  loginSchema,
  noteSchema,
  bookmarkSchema,
  searchQuerySchema,
  fetchTitleQuerySchema,
  validateBody,
  validateQuery,
};

