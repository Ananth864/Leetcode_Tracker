import { SearchBar } from '@/components/SearchBar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TagFilter } from './TagFilter';
import { HugeiconsIcon } from '@hugeicons/react';
import { PinIcon } from '@hugeicons/core-free-icons';
import { cn, formatDate } from '@/lib/utils';
import type { Note } from '@/types';

interface NoteListProps {
  notes: Note[];
  totalCount: number;
  selectedNoteId: string | null;
  onSelect: (id: string) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  availableTags: string[];
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
  onClearTags: () => void;
  className?: string;
}

export function NoteList({
  notes,
  totalCount,
  selectedNoteId,
  onSelect,
  searchTerm,
  onSearchChange,
  availableTags,
  selectedTags,
  onToggleTag,
  onClearTags,
  className,
}: NoteListProps) {
  return (
    <div className={cn('flex flex-col', className)}>
      <div className="space-y-3 border-b p-4">
        <SearchBar value={searchTerm} onChange={onSearchChange} placeholder="Search notes..." />
        <TagFilter
          availableTags={availableTags}
          selectedTags={selectedTags}
          onToggle={onToggleTag}
          onClear={onClearTags}
        />
      </div>

      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          {notes.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">
              {totalCount === 0
                ? 'No notes yet. Create one to get started.'
                : 'No notes match your filters.'}
            </div>
          ) : (
            <ul className="divide-y">
              {notes.map((note) => {
                const active = note.id === selectedNoteId;
                const visibleTags = note.tags.slice(0, 2);
                const extraTags = note.tags.length - visibleTags.length;
                return (
                  <li key={note.id}>
                    <button
                      type="button"
                      onClick={() => onSelect(note.id)}
                      className={cn(
                        'flex w-full flex-col gap-1.5 px-4 py-3 text-left transition-colors',
                        'hover:bg-accent',
                        active && 'bg-primary/10'
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {note.pinned && (
                          <HugeiconsIcon icon={PinIcon} strokeWidth={2} className="h-3.5 w-3.5 shrink-0 text-primary" />
                        )}
                        <span className={cn('truncate text-sm font-medium', active && 'text-primary')}>
                          {note.title}
                        </span>
                      </div>
                      {note.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {visibleTags.map((tag) => (
                            <Badge key={tag} variant="outline" className="px-1.5 py-0 text-[10px]">
                              {tag}
                            </Badge>
                          ))}
                          {extraTags > 0 && (
                            <Badge variant="outline" className="px-1.5 py-0 text-[10px]">
                              +{extraTags}
                            </Badge>
                          )}
                        </div>
                      )}
                      <span className="text-[11px] text-muted-foreground">
                        {formatDate(note.updatedAt)}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
