import { z } from 'zod';
import type { Progress, Question, GistData } from '@/types';

export const progressEnum = z.enum(['red', 'orange', 'yellow', 'green']) satisfies z.ZodType<Progress>;

export const questionSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required'),
  url: z.string().url('Invalid URL'),
  progress: progressEnum,
  topics: z.array(z.string()),
  hints: z.tuple([
    z.string().optional(),
    z.string().optional(),
    z.string().optional(),
  ]),
  createdAt: z.string(),
}) satisfies z.ZodType<Question>;

export const gistDataSchema = z.object({
  questions: z.array(questionSchema),
  lastSynced: z.string(),
  gistId: z.string().optional(),
}) satisfies z.ZodType<GistData>;

export const createQuestionSchema = questionSchema.partial({
  id: true,
  createdAt: true,
});

export const updateQuestionSchema = questionSchema.partial();
