import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import type { Question, Note, GistData, SyncStatus } from '@/types';
import { nanoid } from 'nanoid';
import {
  loadQuestions,
  saveQuestions,
  loadNotes,
  saveNotes,
  loadGistId,
  saveGistId,
  saveLastSynced,
  loadLastSynced,
} from '@/lib/storage';
import { syncToGist, syncFromGist } from '@/lib/github-gist';
import { sortQuestions, sortNotes } from '@/lib/utils';

interface QuestionContextValue {
  questions: Question[];
  addQuestion: (question: Omit<Question, 'id' | 'createdAt'>) => Promise<void>;
  updateQuestion: (id: string, updates: Partial<Question>) => Promise<void>;
  deleteQuestion: (id: string) => Promise<void>;
  notes: Note[];
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Note | null>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  syncToGist: () => Promise<void>;
  syncFromGist: (gistId: string) => Promise<void>;
  syncStatus: SyncStatus;
  lastSynced: string | null;
  importFromGist: boolean;
  setImportFromGist: (value: boolean) => void;
  gistId: string | null;
}

const QuestionContext = createContext<QuestionContextValue | undefined>(undefined);

export function QuestionProvider({ children }: { children: ReactNode }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [lastSynced, setLastSynced] = useState<string | null>(null);
  const [importFromGist, setImportFromGist] = useState(false);
  const [gistId, setGistIdState] = useState<string | null>(null);

  const questionsRef = useRef<Question[]>([]);
  const notesRef = useRef<Note[]>([]);
  const gistIdRef = useRef<string | null>(null);

  questionsRef.current = questions;
  notesRef.current = notes;
  gistIdRef.current = gistId;

  useEffect(() => {
    const init = async () => {
      const savedQuestions = loadQuestions();
      const savedNotes = loadNotes();
      const savedGistId = loadGistId();
      const savedLastSynced = loadLastSynced();

      if (savedQuestions) {
        setQuestions(savedQuestions);
      }

      if (savedNotes) {
        setNotes(savedNotes);
      }

      if (savedLastSynced) {
        setLastSynced(savedLastSynced);
      }

      try {
        const { getGistClient } = await import('@/lib/github-gist');
        const client = getGistClient();

        let gistIdToLoad = savedGistId;

        if (!gistIdToLoad) {
          const existingGists = await client.listGists();
          if (existingGists.length > 0) {
            gistIdToLoad = existingGists[0].id;
          }
        }

        if (gistIdToLoad) {
          const result = await syncFromGist(gistIdToLoad, setSyncStatus);
          if (result.success && result.data) {
            const sortedQuestions = sortQuestions(result.data.questions);
            setQuestions(sortedQuestions);
            saveQuestions(sortedQuestions);
            if (result.data.notes) {
              const sortedNotes = sortNotes(result.data.notes);
              setNotes(sortedNotes);
              saveNotes(sortedNotes);
            }
            setGistIdState(gistIdToLoad);
            saveGistId(gistIdToLoad);
            if (result.data.lastSynced) {
              setLastSynced(result.data.lastSynced);
              saveLastSynced(result.data.lastSynced);
            }
          }
        }
      } catch {
        // Silently fall back to local data if gist load fails
      }
    };

    init();
  }, []);

  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const buildGistData = useCallback((): GistData => {
    return {
      questions: questionsRef.current,
      notes: notesRef.current,
      lastSynced: new Date().toISOString(),
      gistId: gistIdRef.current || loadGistId() || undefined,
    };
  }, []);

  const debouncedSync = useCallback(
    async () => {
      if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
      const data = buildGistData();
      debounceTimeoutRef.current = setTimeout(async () => {
        const result = await syncToGist(data, setSyncStatus);
        if (result.success && result.gistId) {
          saveGistId(result.gistId);
          saveLastSynced(new Date().toISOString());
          setLastSynced(new Date().toISOString());
          setGistIdState(result.gistId);
        }
      }, 500);
    },
    [buildGistData]
  );

  const addQuestion = useCallback(
    async (question: Omit<Question, 'id' | 'createdAt'>) => {
      const newQuestion: Question = {
        ...question,
        id: nanoid(),
        createdAt: new Date().toISOString(),
      };

      const updatedQuestions = sortQuestions([...questionsRef.current, newQuestion]);
      setQuestions(updatedQuestions);
      saveQuestions(updatedQuestions);

      await debouncedSync();
    },
    [debouncedSync]
  );

  const updateQuestion = useCallback(
    async (id: string, updates: Partial<Question>) => {
      const updatedQuestions = questionsRef.current.map((q) =>
        q.id === id ? { ...q, ...updates } : q
      );
      const sortedQuestions = sortQuestions(updatedQuestions);
      setQuestions(sortedQuestions);
      saveQuestions(sortedQuestions);

      await debouncedSync();
    },
    [debouncedSync]
  );

  const deleteQuestion = useCallback(
    async (id: string) => {
      const updatedQuestions = questionsRef.current.filter((q) => q.id !== id);
      setQuestions(updatedQuestions);
      saveQuestions(updatedQuestions);

      await debouncedSync();
    },
    [debouncedSync]
  );

  const addNote = useCallback(
    async (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
      const now = new Date().toISOString();
      const newNote: Note = {
        ...note,
        id: nanoid(),
        createdAt: now,
        updatedAt: now,
      };

      const updatedNotes = sortNotes([...notesRef.current, newNote]);
      setNotes(updatedNotes);
      saveNotes(updatedNotes);

      await debouncedSync();
      return newNote;
    },
    [debouncedSync]
  );

  const updateNote = useCallback(
    async (id: string, updates: Partial<Note>) => {
      const updatedNotes = notesRef.current.map((n) =>
        n.id === id
          ? { ...n, ...updates, updatedAt: new Date().toISOString() }
          : n
      );
      const sortedNotes = sortNotes(updatedNotes);
      setNotes(sortedNotes);
      saveNotes(sortedNotes);

      await debouncedSync();
    },
    [debouncedSync]
  );

  const deleteNote = useCallback(
    async (id: string) => {
      const updatedNotes = notesRef.current.filter((n) => n.id !== id);
      setNotes(updatedNotes);
      saveNotes(updatedNotes);

      await debouncedSync();
    },
    [debouncedSync]
  );

  const handleSyncToGist = useCallback(async () => {
    const data = buildGistData();

    const result = await syncToGist(data, setSyncStatus);
    if (result.success && result.gistId) {
      saveGistId(result.gistId);
      saveLastSynced(new Date().toISOString());
      setLastSynced(new Date().toISOString());
      setGistIdState(result.gistId);
    }
  }, [buildGistData]);

  const handleSyncFromGist = useCallback(
    async (newGistId: string) => {
      const result = await syncFromGist(newGistId, setSyncStatus);
      if (result.success && result.data) {
        const sortedQuestions = sortQuestions(result.data.questions);
        setQuestions(sortedQuestions);
        saveQuestions(sortedQuestions);
        if (result.data.notes) {
          const sortedNotes = sortNotes(result.data.notes);
          setNotes(sortedNotes);
          saveNotes(sortedNotes);
        }
        saveGistId(newGistId);
        saveLastSynced(new Date().toISOString());
        setLastSynced(new Date().toISOString());
        setGistIdState(newGistId);
        setImportFromGist(false);
      }
    },
    [setImportFromGist]
  );

  const value: QuestionContextValue = {
    questions,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    notes,
    addNote,
    updateNote,
    deleteNote,
    syncToGist: handleSyncToGist,
    syncFromGist: handleSyncFromGist,
    syncStatus,
    lastSynced,
    importFromGist,
    setImportFromGist,
    gistId,
  };

  return <QuestionContext.Provider value={value}>{children}</QuestionContext.Provider>;
}

export function useQuestions() {
  const context = useContext(QuestionContext);
  if (!context) {
    throw new Error('useQuestions must be used within QuestionProvider');
  }
  return context;
}

export function useNotes() {
  const context = useContext(QuestionContext);
  if (!context) {
    throw new Error('useNotes must be used within QuestionProvider');
  }
  const { notes, addNote, updateNote, deleteNote } = context;
  return { notes, addNote, updateNote, deleteNote };
}
