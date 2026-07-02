import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { TopicSelector } from '@/components/TopicSelector';
import { NoteBody } from './NoteBody';
import { DEFAULT_NOTE_TAGS } from '@/data/note-tags';
import { HugeiconsIcon } from '@hugeicons/react';
import { Edit01Icon, ViewIcon } from '@hugeicons/core-free-icons';
import type { Note } from '@/types';

export interface NoteDraft {
  title: string;
  body: string;
  tags: string[];
  pinned: boolean;
  sourceUrl?: string;
}

interface NoteEditorProps {
  initial: Note | null;
  onSave: (draft: NoteDraft) => Promise<void>;
  onCancel: () => void;
}

export function NoteEditor({ initial, onSave, onCancel }: NoteEditorProps) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [body, setBody] = useState(initial?.body ?? '');
  const [tags, setTags] = useState<string[]>(initial?.tags ?? []);
  const [pinned, setPinned] = useState(initial?.pinned ?? false);
  const [sourceUrl, setSourceUrl] = useState(initial?.sourceUrl ?? '');
  const [isPreview, setIsPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setIsSubmitting(true);
    try {
      await onSave({
        title: title.trim(),
        body,
        tags,
        pinned,
        sourceUrl: sourceUrl.trim() === '' ? undefined : sourceUrl.trim(),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex h-full flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <Input
          type="text"
          placeholder="Note title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border-0 px-0 text-xl font-bold focus-visible:ring-0"
          autoFocus
          required
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsPreview((v) => !v)}
          disabled={!body.trim() && !title.trim()}
        >
          <HugeiconsIcon icon={isPreview ? Edit01Icon : ViewIcon} strokeWidth={2} className="h-4 w-4 mr-2" />
          {isPreview ? 'Edit' : 'Preview'}
        </Button>
      </div>

      {isPreview ? (
        <div className="flex-1 overflow-auto">
          <NoteBody body={body} />
        </div>
      ) : (
        <Textarea
          placeholder={"Write your note... use ``` for code blocks\n\n```python\nclass ListNode:\n    ...\n```"}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="flex-1 min-h-[240px] resize-none text-xs leading-relaxed"
        />
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Tags</Label>
          <TopicSelector selectedTopics={tags} onTopicsChange={setTags} defaultTags={DEFAULT_NOTE_TAGS} />
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="space-y-2 sm:flex-1">
            <Label htmlFor="sourceUrl">Source URL (optional)</Label>
            <Input
              id="sourceUrl"
              type="url"
              placeholder="https://leetcode.com/problems/..."
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 pt-6">
            <Switch id="pinned" checked={pinned} onCheckedChange={setPinned} />
            <Label htmlFor="pinned" className="cursor-pointer">Pin to top</Label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || !title.trim()}>
            {isSubmitting ? 'Saving...' : initial ? 'Save Changes' : 'Create Note'}
          </Button>
        </div>
      </div>
    </form>
  );
}
