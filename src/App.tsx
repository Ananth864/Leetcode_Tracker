import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { QuestionProvider, useQuestions } from '@/context/QuestionContext';
import { QuestionTable } from '@/components/QuestionTable';
import { AddQuestionModal } from '@/components/AddQuestionModal';
import { SearchBar } from '@/components/SearchBar';
import { FilterControls } from '@/components/FilterControls';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SyncButton } from '@/components/SyncButton';
import { SettingsDialog } from '@/components/SettingsDialog';
import { Button } from '@/components/ui/button';
import { Sidebar } from '@/components/Sidebar';
import { RandomPicker } from '@/components/RandomPicker';

import { TooltipProvider } from '@/components/ui/tooltip';
import { HugeiconsIcon } from '@hugeicons/react';
import { PlusSignIcon, CodeIcon, Settings01Icon } from '@hugeicons/core-free-icons';
import { filterQuestions, getAllTopics } from '@/lib/utils';
import type { Progress } from '@/types';

interface PageProps {
  onOpenModal: (prefill?: { title: string; url: string }) => void;
}

function TrackerPage({ onOpenModal }: PageProps) {
  const {
    questions,
    updateQuestion,
    deleteQuestion,
    syncToGist,
    syncFromGist,
    syncStatus,
    lastSynced,
    gistId,
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

  const handleTopicsChange = (id: string, topics: string[]) => {
    updateQuestion(id, { topics });
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
    <div className="flex-1 overflow-auto">
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
            <Button onClick={() => onOpenModal()}>
              <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} className="h-4 w-4 mr-2" />
              Add Question
            </Button>
          </div>
        </header>

        <main>
          <QuestionTable
            questions={filteredQuestions}
            onProgressChange={handleProgressChange}
            onDelete={deleteQuestion}
            onTopicsChange={handleTopicsChange}
          />
        </main>
      </div>
    </div>
  );
}

function LeetcodeTracker({ onOpenModal }: PageProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<RandomPicker onOpenModal={onOpenModal} />} />
          <Route path="/tracker" element={<TrackerPage onOpenModal={onOpenModal} />} />
        </Routes>
      </div>
    </div>
  );
}

function InnerApp() {
  const { addQuestion } = useQuestions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prefillData, setPrefillData] = useState<{ title: string; url: string } | null>(null);

  const handleAddQuestion = async (question: Omit<import('@/types').Question, 'id' | 'createdAt'>) => {
    await addQuestion(question);
  };

  const handleOpenModal = (prefill?: { title: string; url: string }) => {
    if (prefill) {
      setPrefillData(prefill);
    }
    setIsModalOpen(true);
  };

  return (
    <>
      <LeetcodeTracker onOpenModal={handleOpenModal} />
      <AddQuestionModal
        open={isModalOpen}
        onOpenChange={(open) => {
          if (!open) setPrefillData(null);
          setIsModalOpen(open);
        }}
        onAdd={handleAddQuestion}
        prefillData={prefillData}
      >
        <div />
      </AddQuestionModal>
    </>
  );
}

export function App() {
  return (
    <TooltipProvider>
      <QuestionProvider>
        <InnerApp />
      </QuestionProvider>
    </TooltipProvider>
  );
}

export default App;
