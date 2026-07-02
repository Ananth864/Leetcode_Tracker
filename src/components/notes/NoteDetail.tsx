import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { HugeiconsIcon } from '@hugeicons/react';
import { Edit01Icon, Delete02Icon, ExternalLink, PinIcon } from '@hugeicons/core-free-icons';
import { NoteEditor, type NoteDraft } from './NoteEditor';
import { NoteBody } from './NoteBody';
import { extractQuestionTitle, formatDate } from '@/lib/utils';
import type { Note } from '@/types';

interface NoteDetailProps {
  note: Note | null;
  isCreating: boolean;
  onSaveDraft: (draft: NoteDraft, existing: Note | null) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onCancel: () => void;
}

export function NoteDetail({ note, isCreating, onSaveDraft, onDelete, onCancel }: NoteDetailProps) {
  const [isEditing, setIsEditing] = useState(false);

  const showEditor = isCreating || isEditing;
  const sourceLabel = note?.sourceUrl ? extractQuestionTitle(note.sourceUrl) || 'Source' : '';

  if (showEditor) {
    return (
      <div className="h-full p-6">
        <ScrollArea className="h-full">
          <div className="mx-auto max-w-3xl pb-12">
            <NoteEditor
              initial={isCreating ? null : note}
              onSave={async (draft) => {
                await onSaveDraft(draft, isCreating ? null : note);
                if (!isCreating) setIsEditing(false);
              }}
              onCancel={onCancel}
            />
          </div>
        </ScrollArea>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
        <HugeiconsIcon icon={Edit01Icon} strokeWidth={1.5} className="h-10 w-10 text-muted-foreground/50" />
        <p className="text-sm text-muted-foreground">
          Select a note to read it, or create a new one.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full p-6">
      <ScrollArea className="h-full">
        <div className="mx-auto max-w-3xl space-y-5 pb-12">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {note.pinned && (
                  <HugeiconsIcon icon={PinIcon} strokeWidth={2} className="h-4 w-4 text-primary" />
                )}
                <h1 className="text-2xl font-bold leading-tight">{note.title}</h1>
              </div>
              {note.sourceUrl && (
                <a
                  href={note.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  <HugeiconsIcon icon={ExternalLink} strokeWidth={2} className="h-3.5 w-3.5" />
                  {sourceLabel}
                </a>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                <HugeiconsIcon icon={Edit01Icon} strokeWidth={2} className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon-sm" className="text-destructive hover:text-destructive">
                    <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Note</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete &ldquo;{note.title}&rdquo;? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onDelete(note.id)}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          {note.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {note.tags.map((tag) => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
          )}

          <NoteBody body={note.body} />

          <p className="border-t pt-4 text-xs text-muted-foreground">
            Updated {formatDate(note.updatedAt)}
          </p>
        </div>
      </ScrollArea>
    </div>
  );
}
