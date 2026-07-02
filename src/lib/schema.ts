import { z } from 'zod';
import type { Progress, Question, Note, GistData } from '@/types';

export const progressEnum = z.enum(['red', 'orange', 'yellow', 'green']) satisfies z.ZodType<Progress>;

export const questionSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required'),
  url: z.string().url('Invalid URL'),
  progress: progressEnum,
  topics: z.array(z.string()),
  hints: z.tuple([
    z.string().nullable().optional(),
    z.string().nullable().optional(),
    z.string().nullable().optional(),
  ]),
  createdAt: z.string(),
}) satisfies z.ZodType<Question>;

export const noteSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required'),
  body: z.string(),
  tags: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
  pinned: z.boolean(),
  sourceUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
}) satisfies z.ZodType<Note>;

export const notesArraySchema = z.array(noteSchema);

export const gistDataSchema = z.object({
  questions: z.array(questionSchema),
  notes: notesArraySchema.optional(),
  lastSynced: z.string(),
  gistId: z.string().optional(),
}) satisfies z.ZodType<GistData>;

export const createNoteSchema = noteSchema.partial({
  id: true,
  createdAt: true,
  updatedAt: true,
  pinned: true,
  sourceUrl: true,
});

export const updateNoteSchema = noteSchema.partial();

export const createQuestionSchema = questionSchema.partial({
  id: true,
  createdAt: true,
});

export const updateQuestionSchema = questionSchema.partial();
