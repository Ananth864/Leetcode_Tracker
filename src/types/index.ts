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

export interface GistData {
  questions: Question[];
  lastSynced: string;
  gistId?: string;
}

export type SyncStatus = 'idle' | 'syncing' | 'success' | 'error';

export interface ProgressOrder {
  [key: string]: number;
}
