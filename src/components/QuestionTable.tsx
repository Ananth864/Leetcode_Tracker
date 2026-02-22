import { QuestionRow } from './QuestionRow';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Question, Progress } from '@/types';

interface QuestionTableProps {
  questions: Question[];
  onProgressChange: (id: string, progress: Progress) => void;
  onDelete: (id: string) => void;
}

export function QuestionTable({
  questions,
  onProgressChange,
  onDelete,
}: QuestionTableProps) {
  return (
    <ScrollArea className="h-[calc(100vh-280px)]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[30%]">Question</TableHead>
            <TableHead className="w-[15%]">Progress</TableHead>
            <TableHead className="w-[35%]">Topics</TableHead>
            <TableHead className="w-[15%]">Hints</TableHead>
            <TableHead className="w-[5%] text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
            {questions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                No questions yet. Click &quot;Add Question&quot; to get started.
              </TableCell>
            </TableRow>
          ) : (
            questions.map((question) => (
              <QuestionRow
                key={question.id}
                question={question}
                onProgressChange={onProgressChange}
                onDelete={onDelete}
              />
            ))
          )}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
