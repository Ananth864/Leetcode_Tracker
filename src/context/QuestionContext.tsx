import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Question, GistData, SyncStatus } from '@/types';
import { nanoid } from 'nanoid';
import {
  loadQuestions,
  saveQuestions,
  loadGistId,
  saveGistId,
  saveLastSynced,
  loadLastSynced,
} from '@/lib/storage';
import { syncToGist, syncFromGist } from '@/lib/github-gist';
import { sortQuestions, debounce } from '@/lib/utils';

interface QuestionContextValue {
  questions: Question[];
  addQuestion: (question: Omit<Question, 'id' | 'createdAt'>) => Promise<void>;
  updateQuestion: (id: string, updates: Partial<Question>) => Promise<void>;
  deleteQuestion: (id: string) => Promise<void>;
  syncToGist: () => Promise<void>;
  syncFromGist: (gistId: string) => Promise<void>;
  syncStatus: SyncStatus;
  lastSynced: string | null;
  showHints: boolean;
  toggleHints: () => void;
  importFromGist: boolean;
  setImportFromGist: (value: boolean) => void;
  gistId: string | null;
}

const QuestionContext = createContext<QuestionContextValue | undefined>(undefined);

export function QuestionProvider({ children }: { children: ReactNode }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [lastSynced, setLastSynced] = useState<string | null>(null);
  const [showHints, setShowHints] = useState(false);
  const [importFromGist, setImportFromGist] = useState(false);
  const [gistId, setGistIdState] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const savedQuestions = loadQuestions();
      const savedGistId = loadGistId();
      const savedLastSynced = loadLastSynced();

      if (savedQuestions) {
        setQuestions(savedQuestions);
      }

      if (savedGistId) {
        setGistIdState(savedGistId);
      }

      if (savedLastSynced) {
        setLastSynced(savedLastSynced);
      }
    };

    init();
  }, []);

  const debouncedSync = useCallback(
    debounce(async (...args: unknown[]) => {
      const result = await syncToGist(args[0] as GistData, setSyncStatus);
      if (result.success && result.gistId) {
        saveGistId(result.gistId);
        saveLastSynced(new Date().toISOString());
        setLastSynced(new Date().toISOString());
        setGistIdState(result.gistId);
      }
    }, 500),
    []
  );

  const addQuestion = useCallback(
    async (question: Omit<Question, 'id' | 'createdAt'>) => {
      const newQuestion: Question = {
        ...question,
        id: nanoid(),
        createdAt: new Date().toISOString(),
      };

      const updatedQuestions = sortQuestions([...questions, newQuestion]);
      setQuestions(updatedQuestions);
      saveQuestions(updatedQuestions);

      const currentGistId = gistId || loadGistId();
      const data: GistData = {
        questions: updatedQuestions,
        lastSynced: new Date().toISOString(),
        gistId: currentGistId || undefined,
      };

      await debouncedSync(data);
    },
    [questions, gistId, debouncedSync]
  );

  const updateQuestion = useCallback(
    async (id: string, updates: Partial<Question>) => {
      const updatedQuestions = questions.map(q =>
        q.id === id ? { ...q, ...updates } : q
      );
      const sortedQuestions = sortQuestions(updatedQuestions);
      setQuestions(sortedQuestions);
      saveQuestions(sortedQuestions);

      const currentGistId = gistId || loadGistId();
      const data: GistData = {
        questions: sortedQuestions,
        lastSynced: new Date().toISOString(),
        gistId: currentGistId || undefined,
      };

      await debouncedSync(data);
    },
    [questions, gistId, debouncedSync]
  );

  const deleteQuestion = useCallback(
    async (id: string) => {
      const updatedQuestions = questions.filter(q => q.id !== id);
      setQuestions(updatedQuestions);
      saveQuestions(updatedQuestions);

      const currentGistId = gistId || loadGistId();
      const data: GistData = {
        questions: updatedQuestions,
        lastSynced: new Date().toISOString(),
        gistId: currentGistId || undefined,
      };

      await debouncedSync(data);
    },
    [questions, gistId, debouncedSync]
  );

  const handleSyncToGist = useCallback(async () => {
    const currentGistId = gistId || loadGistId();
    const data: GistData = {
      questions,
      lastSynced: new Date().toISOString(),
      gistId: currentGistId || undefined,
    };

    const result = await syncToGist(data, setSyncStatus);
    if (result.success && result.gistId) {
      saveGistId(result.gistId);
      saveLastSynced(new Date().toISOString());
      setLastSynced(new Date().toISOString());
      setGistIdState(result.gistId);
    }
  }, [questions, gistId]);

  const handleSyncFromGist = useCallback(
    async (newGistId: string) => {
      const result = await syncFromGist(newGistId, setSyncStatus);
      if (result.success && result.data) {
        const sortedQuestions = sortQuestions(result.data.questions);
        setQuestions(sortedQuestions);
        saveQuestions(sortedQuestions);
        saveGistId(newGistId);
        saveLastSynced(new Date().toISOString());
        setLastSynced(new Date().toISOString());
        setGistIdState(newGistId);
        setImportFromGist(false);
      }
    },
    [setImportFromGist]
  );

  const toggleHints = useCallback(() => {
    setShowHints(prev => !prev);
  }, []);

  const value: QuestionContextValue = {
    questions,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    syncToGist: handleSyncToGist,
    syncFromGist: handleSyncFromGist,
    syncStatus,
    lastSynced,
    showHints,
    toggleHints,
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
