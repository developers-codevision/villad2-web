// Page Header Component - Reusable for all admin modules

import { Plus, LucideIcon } from 'lucide-react';
import { Button } from '@/modules/shared/components/ui/button';

interface PageHeaderProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionIcon?: LucideIcon;
  onAction?: () => void;
}

export function PageHeader({
  title,
  description,
  actionLabel,
  actionIcon: Icon = Plus,
  onAction
}: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div className="flex-1">
        <h1 className="text-xl sm:text-2xl font-bold mb-1">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="w-full sm:w-auto">
          <Icon className="mr-2 h-4 w-4" />
          <span className="sm:inline">{actionLabel}</span>
        </Button>
      )}
    </div>
  );
}

