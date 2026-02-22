import { memo } from 'react';
import type { Question, Progress } from '@/types';
import { ProgressCell } from './ProgressCell';
import { HintsCell } from './HintsCell';
import { Badge } from '@/components/ui/badge';
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
  showHints: boolean;
  onProgressChange: (id: string, progress: Progress) => void;
  onDelete: (id: string) => void;
}

export const QuestionRow = memo(
  function QuestionRow({ question, showHints, onProgressChange, onDelete }: QuestionRowProps) {
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
          <div className="flex flex-wrap gap-1">
            {question.topics.map((topic) => (
              <Badge key={topic} variant="secondary" className="text-xs">
                {topic}
              </Badge>
            ))}
          </div>
        </td>
        <td className="py-3 px-4">
          <HintsCell hints={question.hints} showHints={showHints} />
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
