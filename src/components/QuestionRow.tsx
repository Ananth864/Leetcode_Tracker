import { memo, useState } from 'react';
import type { Question, Progress } from '@/types';
import { ProgressCell } from './ProgressCell';
import { HintsCell } from './HintsCell';
import { TopicSelector } from './TopicSelector';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
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
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { Delete02Icon } from '@hugeicons/core-free-icons';

interface QuestionRowProps {
  question: Question;
  onProgressChange: (id: string, progress: Progress) => void;
  onDelete: (id: string) => void;
  onTopicsChange: (id: string, topics: string[]) => void;
}

export const QuestionRow = memo(
  function QuestionRow({ question, onProgressChange, onDelete, onTopicsChange }: QuestionRowProps) {
    const [topicsOpen, setTopicsOpen] = useState(false);
    return (
      <tr className="border-b border-border hover:bg-muted/50 transition-colors">
        <td className="py-3 px-4">
          <a
            href={question.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary hover:underline inline-flex items-center gap-1"
          >
            {question.title}
          </a>
        </td>
        <td className="py-3 px-4">
          <ProgressCell
            progress={question.progress}
            onProgressChange={(progress) => onProgressChange(question.id, progress)}
          />
        </td>
        <td className="py-3 px-4">
          <Popover open={topicsOpen} onOpenChange={setTopicsOpen}>
            <PopoverTrigger asChild>
              <button className="flex flex-wrap gap-1 cursor-pointer text-left">
                {question.topics.length > 0 ? (
                  question.topics.map((topic) => (
                    <Badge key={topic} variant="secondary" className="text-xs">
                      {topic}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">+ Add topics</span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2" align="start">
              <TopicSelector
                selectedTopics={question.topics}
                onTopicsChange={(topics) => onTopicsChange(question.id, topics)}
              />
            </PopoverContent>
          </Popover>
        </td>
        <td className="py-3 px-4">
          <HintsCell hints={question.hints} />
        </td>
        <td className="py-3 px-4 text-right">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Question</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{question.title}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(question.id)}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </td>
      </tr>
    );
  }
);
