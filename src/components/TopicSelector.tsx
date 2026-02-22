import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { HugeiconsIcon } from '@hugeicons/react';
import { CancelCircleIcon, PlusSignIcon } from '@hugeicons/core-free-icons';
import { DEFAULT_TOPICS } from '@/data/topics';

interface TopicSelectorProps {
  selectedTopics: string[];
  onTopicsChange: (topics: string[]) => void;
}

export function TopicSelector({ selectedTopics, onTopicsChange }: TopicSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const allTopics = [...DEFAULT_TOPICS];
  const selectedTopicsSet = new Set(selectedTopics);

  const filteredTopics = allTopics.filter((topic) =>
    topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const canCreateNew = searchQuery.trim() !== '' && !allTopics.some(
    (topic) => topic.toLowerCase() === searchQuery.toLowerCase()
  );

  const handleAddTopic = (topic: string) => {
    if (!selectedTopicsSet.has(topic)) {
      onTopicsChange([...selectedTopics, topic]);
    }
    setSearchQuery('');
  };

  const handleRemoveTopic = (topic: string) => {
    onTopicsChange(selectedTopics.filter((t) => t !== topic));
  };

  const handleCreateNew = () => {
    if (canCreateNew) {
      handleAddTopic(searchQuery.trim());
      setSearchQuery('');
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {selectedTopics.map((topic) => (
          <Badge
            key={topic}
            variant="secondary"
            className="flex items-center gap-1 px-2 py-1"
          >
            {topic}
            <button
              type="button"
              onClick={() => handleRemoveTopic(topic)}
              className="ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5"
            >
              <HugeiconsIcon icon={CancelCircleIcon} strokeWidth={2} className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        {selectedTopics.length === 0 && (
          <span className="text-sm text-muted-foreground">No topics selected</span>
        )}
      </div>

      <div className="border rounded-md">
        <Command shouldFilter={false}>
          <div className="flex items-center px-3">
            <CommandInput
              placeholder="Search or create topic..."
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="border-0 focus:ring-0 h-9"
            />
            {canCreateNew && (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={handleCreateNew}
                className="h-7 px-2"
              >
                <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} className="h-4 w-4 mr-1" />
                Create
              </Button>
            )}
          </div>
          {searchQuery && (
            <CommandList>
              <CommandEmpty>No topics found</CommandEmpty>
              <CommandGroup>
                {filteredTopics.map((topic) => (
                  <CommandItem
                    key={topic}
                    value={topic}
                    onSelect={() => handleAddTopic(topic)}
                    disabled={selectedTopicsSet.has(topic)}
                  >
                    <div className="flex items-center gap-2">
                      {selectedTopicsSet.has(topic) && (
                        <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} className="h-4 w-4" />
                      )}
                      {topic}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          )}
        </Command>
      </div>
    </div>
  );
}
