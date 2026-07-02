import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Question, Note, ProgressOrder, Progress } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function extractQuestionTitle(url: string): string {
  try {
    const urlObj = new URL(url);
    const pathMatch = urlObj.pathname.match(/\/problems\/([^/]+)/);
    
    if (pathMatch && pathMatch[1]) {
      const kebabCaseTitle = pathMatch[1];
      const titleCaseTitle = kebabCaseTitle
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      return titleCaseTitle;
    }
    
    return '';
  } catch (error) {
    console.error('Failed to extract question title from URL:', error);
    return '';
  }
}

export function sortQuestions(questions: Question[]): Question[] {
  const progressOrder: ProgressOrder = {
    red: 0,
    orange: 1,
    yellow: 2,
    green: 3,
  };
  
  return [...questions].sort((a, b) => {
    const aPriority = progressOrder[a.progress];
    const bPriority = progressOrder[b.progress];
    
    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }
    
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

export function filterQuestions(
  questions: Question[],
  searchTerm: string,
  progressFilter: Progress | 'all',
  topicFilter: string | 'all'
): Question[] {
  return questions.filter(question => {
    const matchesSearch = searchTerm === '' || 
      question.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesProgress = progressFilter === 'all' || 
      question.progress === progressFilter;
    
    const matchesTopic = topicFilter === 'all' || 
      question.topics.includes(topicFilter);
    
    return matchesSearch && matchesProgress && matchesTopic;
  });
}

export function getAllTopics(questions: Question[]): string[] {
  const topicsSet = new Set<string>();
  questions.forEach(question => {
    question.topics.forEach(topic => topicsSet.add(topic));
  });
  return Array.from(topicsSet).sort();
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function normalizeQuestionUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const match = urlObj.pathname.match(/(\/problems\/[^/]+)/);

    if (match && match[1]) {
      urlObj.pathname = match[1];
    }

    return urlObj.toString();
  } catch {
    return url;
  }
}

export type NoteSegment = { type: 'code' | 'text'; content: string };

export function renderFences(body: string): NoteSegment[] {
  if (!body) return [];
  const parts = body.split('```');
  const segments: NoteSegment[] = [];

  parts.forEach((part, idx) => {
    if (idx % 2 === 0) {
      if (part.trim()) {
        segments.push({ type: 'text', content: part });
      }
    } else {
      const trimmed = part.replace(/^\n/, '').replace(/\n+$/, '');
      const langMatch = trimmed.match(/^[a-zA-Z0-9_+-]*\n/);
      const code = langMatch ? trimmed.slice(langMatch[0].length) : trimmed;
      if (code.trim()) {
        segments.push({ type: 'code', content: code });
      }
    }
  });

  return segments;
}

export function filterNotes(
  notes: Note[],
  searchTerm: string,
  selectedTags: string[]
): Note[] {
  const term = searchTerm.trim().toLowerCase();
  return notes.filter((note) => {
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.every((tag) => note.tags.includes(tag));
    if (!matchesTags) return false;
    if (!term) return true;
    return (
      note.title.toLowerCase().includes(term) ||
      note.body.toLowerCase().includes(term) ||
      note.tags.some((tag) => tag.toLowerCase().includes(term))
    );
  });
}

export function sortNotes(notes: Note[]): Note[] {
  return [...notes].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
}

export function getAllNoteTags(notes: Note[], seed: readonly string[] = []): string[] {
  const tagsSet = new Set<string>(seed);
  notes.forEach((note) => note.tags.forEach((tag) => tagsSet.add(tag)));
  return Array.from(tagsSet).sort();
}
