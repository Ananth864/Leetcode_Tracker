import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Progress } from '@/types';

interface FilterControlsProps {
  progressFilter: Progress | 'all';
  onProgressChange: (filter: Progress | 'all') => void;
  topicFilter: string | 'all';
  onTopicChange: (filter: string | 'all') => void;
  availableTopics: string[];
}

export function FilterControls({
  progressFilter,
  onProgressChange,
  topicFilter,
  onTopicChange,
  availableTopics,
}: FilterControlsProps) {
  return (
    <div className="flex gap-2">
      <Select value={progressFilter} onValueChange={(value: Progress | 'all') => onProgressChange(value)}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Progress" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Progress</SelectItem>
          <SelectItem value="red">High</SelectItem>
          <SelectItem value="orange">Medium</SelectItem>
          <SelectItem value="yellow">Low</SelectItem>
          <SelectItem value="green">Done</SelectItem>
        </SelectContent>
      </Select>

      <Select value={topicFilter} onValueChange={onTopicChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Topics" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Topics</SelectItem>
          {availableTopics.map((topic) => (
            <SelectItem key={topic} value={topic}>
              {topic}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
