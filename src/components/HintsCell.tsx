import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

interface HintsCellProps {
  hints: [(string | null)?, (string | null)?, (string | null)?];
}

export function HintsCell({ hints }: HintsCellProps) {
  const hintBadges = [
    { label: 'H1', hint: hints[0] },
    { label: 'H2', hint: hints[1] },
    { label: 'H3', hint: hints[2] },
  ];

  return (
    <TooltipProvider>
      <div className="flex gap-1">
        {hintBadges.map((item, index) => (
          item.hint && (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="cursor-help text-xs font-mono">
                  {item.label}
                </Badge>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <p className="text-sm">{item.hint}</p>
              </TooltipContent>
            </Tooltip>
          )
        ))}
      </div>
    </TooltipProvider>
  );
}
