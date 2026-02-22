import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TopicSelector } from './TopicSelector';
import { extractQuestionTitle } from '@/lib/utils';
import type { Progress } from '@/types';
import type { ReactNode } from 'react';

interface AddQuestionModalProps {
  children: ReactNode;
  onAdd: (question: {
    title: string;
    url: string;
    progress: Progress;
    topics: string[];
    hints: [string?, string?, string?];
  }) => Promise<void>;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AddQuestionModal({
  children,
  onAdd,
  open,
  onOpenChange,
}: AddQuestionModalProps) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [progress, setProgress] = useState<Progress>('red');
  const [topics, setTopics] = useState<string[]>([]);
  const [hints, setHints] = useState<[string, string, string]>(['', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUrlBlur = () => {
    if (url && !title) {
      const extractedTitle = extractQuestionTitle(url);
      if (extractedTitle) {
        setTitle(extractedTitle);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !url.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onAdd({
        title: title.trim(),
        url: url.trim(),
        progress,
        topics,
        hints: [hints[0] || undefined, hints[1] || undefined, hints[2] || undefined],
      });

      setUrl('');
      setTitle('');
      setProgress('red');
      setTopics([]);
      setHints(['', '', '']);
      onOpenChange?.(false);
    } catch (error) {
      console.error('Failed to add question:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Question</DialogTitle>
          <DialogDescription>
            Add a new LeetCode question to track your progress.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">Question URL</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://leetcode.com/problems/two-sum/"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onBlur={handleUrlBlur}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Question Title</Label>
            <Input
              id="title"
              type="text"
              placeholder="Two Sum"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="progress">Progress</Label>
            <Select value={progress} onValueChange={(value: Progress) => setProgress(value)}>
              <SelectTrigger id="progress">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="red">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    High Priority
                  </div>
                </SelectItem>
                <SelectItem value="orange">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500" />
                    Medium Priority
                  </div>
                </SelectItem>
                <SelectItem value="yellow">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    Low Priority
                  </div>
                </SelectItem>
                <SelectItem value="green">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    Done
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Topics</Label>
            <TopicSelector selectedTopics={topics} onTopicsChange={setTopics} />
          </div>

          <div className="space-y-3">
            <Label>Hints (Optional)</Label>
            <div className="space-y-2">
              <Textarea
                placeholder="Hint 1..."
                value={hints[0]}
                onChange={(e) => setHints([e.target.value, hints[1], hints[2]])}
                rows={2}
              />
              <Textarea
                placeholder="Hint 2..."
                value={hints[1]}
                onChange={(e) => setHints([hints[0], e.target.value, hints[2]])}
                rows={2}
              />
              <Textarea
                placeholder="Hint 3..."
                value={hints[2]}
                onChange={(e) => setHints([hints[0], hints[1], e.target.value])}
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange?.(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Question'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
