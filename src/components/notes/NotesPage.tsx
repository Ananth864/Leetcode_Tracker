import { useMemo, useState } from 'react';
import { useQuestions, useNotes } from '@/context/QuestionContext';
import { Button } from '@/components/ui/button';
import { SyncButton } from '@/components/SyncButton';
import { SettingsDialog } from '@/components/SettingsDialog';
import { ThemeToggle } from '@/components/ThemeToggle';
import { NoteList } from './NoteList';
import { NoteDetail } from './NoteDetail';
import type { NoteDraft } from './NoteEditor';
import { HugeiconsIcon } from '@hugeicons/react';
import { NoteEditIcon, PlusSignIcon, Settings01Icon } from '@hugeicons/core-free-icons';
import { sortNotes, filterNotes, getAllNoteTags } from '@/lib/utils';
import { DEFAULT_NOTE_TAGS } from '@/data/note-tags';
import type { Note } from '@/types';

export function NotesPage() {
  const { notes, addNote, updateNote, deleteNote } = useNotes();
  const {
    syncStatus,
    lastSynced,
    gistId,
    syncToGist,
    syncFromGist,
  } = useQuestions();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const sortedNotes = useMemo(() => sortNotes(notes), [notes]);
  const availableTags = useMemo(
    () => getAllNoteTags(notes, DEFAULT_NOTE_TAGS),
    [notes]
  );
  const filteredNotes = useMemo(
    () => filterNotes(sortedNotes, searchTerm, selectedTags),
    [sortedNotes, searchTerm, selectedTags]
  );

  const selectedNote = useMemo(
    () => notes.find((n) => n.id === selectedNoteId) ?? null,
    [notes, selectedNoteId]
  );

  const handleSelect = (id: string) => {
    setSelectedNoteId(id);
    setIsCreating(false);
  };

  const handleNew = () => {
    setIsCreating(true);
  };

  const handleCancel = () => {
    setIsCreating(false);
  };

  const handleSaveDraft = async (draft: NoteDraft, existing: Note | null) => {
    if (existing) {
      await updateNote(existing.id, draft);
      setIsCreating(false);
    } else {
      const created = await addNote(draft);
      if (created) {
        setSelectedNoteId(created.id);
        setIsCreating(false);
      }
    }
  };

  const handleDelete = async (id: string) => {
    await deleteNote(id);
    if (selectedNoteId === id) {
      const remaining = sortedNotes.filter((n) => n.id !== id);
      setSelectedNoteId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleExportJSON = () => {
    const data = JSON.stringify(notes, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leetcode-notes-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-[100dvh] flex-col">
      <header className="border-b">
        <div className="flex items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <HugeiconsIcon icon={NoteEditIcon} strokeWidth={2} className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Notes</h1>
              <p className="text-sm text-muted-foreground">
                {notes.length} {notes.length === 1 ? 'note' : 'notes'} saved
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <SyncButton
              syncStatus={syncStatus}
              lastSynced={lastSynced}
              gistId={gistId}
              onSyncToGist={syncToGist}
              onSyncFromGist={syncFromGist}
              onExportJSON={handleExportJSON}
            />
            <SettingsDialog>
              <Button variant="outline" size="icon">
                <HugeiconsIcon icon={Settings01Icon} strokeWidth={2} className="h-5 w-5" />
              </Button>
            </SettingsDialog>
            <ThemeToggle />
            <Button onClick={handleNew}>
              <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} className="h-4 w-4 mr-2" />
              New Note
            </Button>
          </div>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <NoteList
          className="w-80 shrink-0 border-r"
          notes={filteredNotes}
          totalCount={notes.length}
          selectedNoteId={selectedNoteId}
          onSelect={handleSelect}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          availableTags={availableTags}
          selectedTags={selectedTags}
          onToggleTag={handleToggleTag}
          onClearTags={() => setSelectedTags([])}
        />
        <div className="min-w-0 flex-1">
          <NoteDetail
            key={isCreating ? '__creating__' : selectedNoteId ?? '__empty__'}
            note={isCreating ? null : selectedNote}
            isCreating={isCreating}
            onSaveDraft={handleSaveDraft}
            onDelete={handleDelete}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
}
