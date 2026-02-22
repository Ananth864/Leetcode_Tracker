import { useState } from 'react';
import { QuestionProvider, useQuestions } from '@/context/QuestionContext';
import { QuestionTable } from '@/components/QuestionTable';
import { AddQuestionModal } from '@/components/AddQuestionModal';
import { SearchBar } from '@/components/SearchBar';
import { FilterControls } from '@/components/FilterControls';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SyncButton } from '@/components/SyncButton';
import { Button } from '@/components/ui/button';

import { TooltipProvider } from '@/components/ui/tooltip';
import { HugeiconsIcon } from '@hugeicons/react';
import { PlusSignIcon, CodeIcon } from '@hugeicons/core-free-icons';
import { filterQuestions, getAllTopics } from '@/lib/utils';
import type { Progress } from '@/types';

function LeetcodeTracker() {
  const {
    questions,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    syncToGist,
    syncStatus,
    lastSynced,
  } = useQuestions();

  const [searchTerm, setSearchTerm] = useState('');
  const [progressFilter, setProgressFilter] = useState<Progress | 'all'>('all');
  const [topicFilter, setTopicFilter] = useState<string | 'all'>('all');

  const filteredQuestions = filterQuestions(
    questions,
    searchTerm,
    progressFilter,
    topicFilter
  );

  const availableTopics = getAllTopics(questions);

  const handleProgressChange = (id: string, progress: Progress) => {
    updateQuestion(id, { progress });
  };

  const handleExportJSON = () => {
    const data = JSON.stringify(questions, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leetcode-tracker-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-7xl">
        <header className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <HugeiconsIcon icon={CodeIcon} strokeWidth={2} className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">LeetCode Tracker</h1>
                <p className="text-sm text-muted-foreground">
                  {questions.length} {questions.length === 1 ? 'question' : 'questions'} tracked
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <SyncButton
                syncStatus={syncStatus}
                lastSynced={lastSynced}
                onSyncToGist={syncToGist}
                onExportJSON={handleExportJSON}
              />
              <ThemeToggle />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <SearchBar value={searchTerm} onChange={setSearchTerm} />
              <FilterControls
                progressFilter={progressFilter}
                onProgressChange={setProgressFilter}
                topicFilter={topicFilter}
                onTopicChange={setTopicFilter}
                availableTopics={availableTopics}
              />
            </div>
            <AddQuestionModal onAdd={addQuestion}>
              <Button>
                <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </AddQuestionModal>
          </div>
        </header>

        <main>
          <QuestionTable
            questions={filteredQuestions}
            onProgressChange={handleProgressChange}
            onDelete={deleteQuestion}
          />
        </main>
      </div>
    </div>
  );
}

export function App() {
  return (
    <TooltipProvider>
      <QuestionProvider>
        <LeetcodeTracker />
      </QuestionProvider>
    </TooltipProvider>
  );
}

export default App;
