import { renderFences } from '@/lib/utils';

interface NoteBodyProps {
  body: string;
  className?: string;
}

export function NoteBody({ body, className }: NoteBodyProps) {
  const segments = renderFences(body);

  if (segments.length === 0) {
    return <p className="text-muted-foreground text-sm italic">Empty note</p>;
  }

  return (
    <div className={`space-y-3 ${className ?? ''}`}>
      {segments.map((segment, idx) =>
        segment.type === 'code' ? (
          <pre
            key={idx}
            className="overflow-x-auto rounded-none border bg-muted/40 p-3 text-xs leading-relaxed whitespace-pre"
          >
            <code>{segment.content.replace(/\n$/, '')}</code>
          </pre>
        ) : (
          <div key={idx} className="space-y-2">
            {segment.content
              .split(/\n{2,}/)
              .map((para, pIdx) => (
                <p key={pIdx} className="text-sm leading-relaxed whitespace-pre-wrap">
                  {para.trim()}
                </p>
              ))}
          </div>
        )
      )}
    </div>
  );
}
