import { useState, useMemo } from 'react';
import { useQuestions } from '@/context/QuestionContext';
import { TOP_INTERVIEW_150 } from '@/data/study-plan';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { HugeiconsIcon } from '@hugeicons/react';
import { Radio01Icon, ExternalLink, PlusSignIcon } from '@hugeicons/core-free-icons';
import { normalizeQuestionUrl } from '@/lib/utils';

interface RandomPickerProps {
  onOpenModal?: (prefill?: { title: string; url: string }) => void;
}

export function RandomPicker({ onOpenModal }: RandomPickerProps) {
  const { questions } = useQuestions();
  const [pickedQuestion, setPickedQuestion] = useState<{ title: string; url: string } | null>(null);

  const availableQuestions = useMemo(() => {
    const trackedUrlsSet = new Set(questions.map(q => normalizeQuestionUrl(q.url)));
    return TOP_INTERVIEW_150.filter(
      q => !trackedUrlsSet.has(normalizeQuestionUrl(q.url))
    );
  }, [questions]);

  const pickRandom = () => {
    if (availableQuestions.length === 0) return;
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    setPickedQuestion(availableQuestions[randomIndex]);
  };

  const pickDifferent = () => {
    if (availableQuestions.length <= 1) return;
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * availableQuestions.length);
    } while (availableQuestions[newIndex] === pickedQuestion);
    setPickedQuestion(availableQuestions[newIndex]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Random Question Picker</h1>
          <p className="text-muted-foreground">
            {availableQuestions.length} / {TOP_INTERVIEW_150.length} questions available from Top Interview 150
          </p>
        </div>
        <Button onClick={pickedQuestion ? pickDifferent : pickRandom} disabled={availableQuestions.length === 0} size="lg">
          <HugeiconsIcon icon={Radio01Icon} strokeWidth={2} className="h-5 w-5 mr-2" />
          {pickedQuestion ? 'Pick Another' : 'Pick Random'}
        </Button>
      </div>

      {pickedQuestion && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Selected Question</span>
              <Badge variant="secondary">Random</Badge>
            </CardTitle>
            <CardDescription>Click the button to try a different question</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <a
              href={pickedQuestion.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
            >
              <span className="text-lg font-medium">{pickedQuestion.title}</span>
              <HugeiconsIcon icon={ExternalLink} strokeWidth={2} className="h-5 w-5 text-muted-foreground" />
            </a>
            {onOpenModal && (
              <Button onClick={() => onOpenModal(pickedQuestion)} className="w-full">
                <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} className="h-4 w-4 mr-2" />
                Add to Tracker
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {availableQuestions.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>All Questions Completed!</CardTitle>
            <CardDescription>
              You've tracked all questions from the Top Interview 150 study plan.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Available Questions</CardTitle>
          <CardDescription>
            Questions from Top Interview 150 that you haven't tracked yet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-2">
              {availableQuestions.map((question) => {
                const isSelected = pickedQuestion && normalizeQuestionUrl(pickedQuestion.url) === normalizeQuestionUrl(question.url);
                return (
                <div
                  key={question.url}
                  className={`flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors ${isSelected ? 'border-primary bg-primary/5' : ''}`}
                >
                  <a
                    href={question.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-sm hover:text-primary transition-colors"
                  >
                    {question.title}
                  </a>
                  <div className="flex items-center gap-2">
                    <a
                      href={question.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 rounded hover:bg-accent transition-colors"
                    >
                      <HugeiconsIcon icon={ExternalLink} strokeWidth={2} className="h-4 w-4 text-muted-foreground" />
                    </a>
                    {onOpenModal && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onOpenModal(question)}
                        className="h-7 px-2"
                      >
                        <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
