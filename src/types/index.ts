export type Progress = 'red' | 'orange' | 'yellow' | 'green';

export interface Question {
  id: string;
  title: string;
  url: string;
  progress: Progress;
  topics: string[];
  hints: [(string | null)?, (string | null)?, (string | null)?];
  createdAt: string;
}

export interface Note {
  id: string;
  title: string;
  body: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  pinned: boolean;
  sourceUrl?: string;
}

export interface GistData {
  questions: Question[];
  notes?: Note[];
  lastSynced: string;
  gistId?: string;
}

export type SyncStatus = 'idle' | 'syncing' | 'success' | 'error';

export interface ProgressOrder {
  [key: string]: number;
}
