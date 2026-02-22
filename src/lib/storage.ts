import type { Question } from '@/types';
import { gistDataSchema } from './schema';

const STORAGE_KEYS = {
  QUESTIONS: 'leetcode-tracker-questions',
  GIST_ID: 'leetcode-tracker-gist-id',
  LAST_SYNCED: 'leetcode-tracker-last-synced',
  THEME: 'leetcode-tracker-theme',
} as const;

export function saveQuestions(questions: Question[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
  } catch (error) {
    console.error('Failed to save questions to localStorage:', error);
  }
}

export function loadQuestions(): Question[] | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
    if (!data) return null;
    
    const parsed = JSON.parse(data);
    const result = gistDataSchema.shape.questions.safeParse(parsed);
    
    if (result.success) {
      return result.data;
    }
    
    console.error('Invalid questions data in localStorage:', result.error);
    return null;
  } catch (error) {
    console.error('Failed to load questions from localStorage:', error);
    return null;
  }
}

export function saveGistId(gistId: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.GIST_ID, gistId);
  } catch (error) {
    console.error('Failed to save gistId to localStorage:', error);
  }
}

export function loadGistId(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEYS.GIST_ID);
  } catch (error) {
    console.error('Failed to load gistId from localStorage:', error);
    return null;
  }
}

export function saveLastSynced(timestamp: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LAST_SYNCED, timestamp);
  } catch (error) {
    console.error('Failed to save lastSynced to localStorage:', error);
  }
}

export function loadLastSynced(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEYS.LAST_SYNCED);
  } catch (error) {
    console.error('Failed to load lastSynced from localStorage:', error);
    return null;
  }
}

export function saveTheme(theme: 'light' | 'dark'): void {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  } catch (error) {
    console.error('Failed to save theme to localStorage:', error);
  }
}

export function loadTheme(): 'light' | 'dark' | null {
  try {
    const theme = localStorage.getItem(STORAGE_KEYS.THEME);
    return theme === 'light' || theme === 'dark' ? theme : null;
  } catch (error) {
    console.error('Failed to load theme from localStorage:', error);
    return null;
  }
}

export function clearGistData(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.GIST_ID);
    localStorage.removeItem(STORAGE_KEYS.LAST_SYNCED);
  } catch (error) {
    console.error('Failed to clear gist data from localStorage:', error);
  }
}
