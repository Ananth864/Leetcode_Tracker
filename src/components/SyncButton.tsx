import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { HugeiconsIcon } from '@hugeicons/react';
import { Refresh03Icon, Download03Icon, Upload03Icon, CloudIcon } from '@hugeicons/core-free-icons';
import { formatDate } from '@/lib/utils';
import type { SyncStatus } from '@/types';

interface SyncButtonProps {
  syncStatus: SyncStatus;
  lastSynced: string | null;
  onSyncToGist: () => void;
  onExportJSON: () => void;
}

export function SyncButton({
  syncStatus,
  lastSynced,
  onSyncToGist,
  onExportJSON,
}: SyncButtonProps) {
  const getStatusIcon = () => {
    if (syncStatus === 'syncing') {
      return <HugeiconsIcon icon={Refresh03Icon} strokeWidth={2} className="h-4 w-4 animate-spin" />;
    }
    return <HugeiconsIcon icon={CloudIcon} strokeWidth={2} className="h-4 w-4" />;
  };

  const getStatusText = () => {
    if (syncStatus === 'syncing') return 'Syncing...';
    if (syncStatus === 'error') return 'Sync Failed';
    if (syncStatus === 'success') return 'Synced';
    return 'Sync';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          {getStatusIcon()}
          {getStatusText()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={onSyncToGist} disabled={syncStatus === 'syncing'}>
          <HugeiconsIcon icon={Upload03Icon} strokeWidth={2} className="h-4 w-4 mr-2" />
          Backup to Gist
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onExportJSON}>
          <HugeiconsIcon icon={Download03Icon} strokeWidth={2} className="h-4 w-4 mr-2" />
          Export as JSON
        </DropdownMenuItem>
        {lastSynced && (
          <div className="px-2 py-1.5 text-xs text-muted-foreground">
            Last synced: {formatDate(lastSynced)}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
