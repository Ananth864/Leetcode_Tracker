import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import type { Progress } from '@/types';

interface ProgressCellProps {
  progress: Progress;
  onProgressChange: (progress: Progress) => void;
}

const progressConfig = {
  red: { label: 'High', color: 'text-red-700 dark:text-red-400' },
  orange: { label: 'Medium', color: 'text-orange-700 dark:text-orange-400' },
  yellow: { label: 'Low', color: 'text-yellow-700 dark:text-yellow-400' },
  green: { label: 'Done', color: 'text-green-700 dark:text-green-400' },
};

const progressOrder: Progress[] = ['red', 'orange', 'yellow', 'green'];

export function ProgressCell({ progress, onProgressChange }: ProgressCellProps) {
  const config = progressConfig[progress];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Badge
          variant="outline"
          className={`cursor-pointer hover:opacity-80 transition-opacity ${config.color}`}
        >
          {config.label}
        </Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {progressOrder.map((p) => (
          <DropdownMenuItem
            key={p}
            onClick={() => onProgressChange(p)}
            className={p === progress ? 'bg-accent' : ''}
          >
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  p === 'red'
                    ? 'bg-red-500'
                    : p === 'orange'
                      ? 'bg-orange-500'
                      : p === 'yellow'
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                }`}
              />
              {progressConfig[p].label}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
