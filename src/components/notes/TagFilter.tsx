import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TagFilterProps {
  availableTags: string[];
  selectedTags: string[];
  onToggle: (tag: string) => void;
  onClear: () => void;
  className?: string;
}

export function TagFilter({
  availableTags,
  selectedTags,
  onToggle,
  onClear,
  className,
}: TagFilterProps) {
  if (availableTags.length === 0) return null;

  const selectedSet = new Set(selectedTags);

  return (
    <div className={cn('flex flex-wrap gap-1.5', className)}>
      {availableTags.map((tag) => {
        const active = selectedSet.has(tag);
        return (
          <button key={tag} type="button" onClick={() => onToggle(tag)} className="focus:outline-none">
            <Badge
              variant={active ? 'default' : 'outline'}
              className="cursor-pointer select-none transition-colors"
            >
              {tag}
            </Badge>
          </button>
        );
      })}
      {selectedTags.length > 0 && (
        <button type="button" onClick={onClear} className="focus:outline-none">
          <Badge variant="secondary" className="cursor-pointer select-none">
            Clear
          </Badge>
        </button>
      )}
    </div>
  );
}
