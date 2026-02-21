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
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      {actionLabel && onAction && (
        <Button onClick={onAction}>
          <Icon className="mr-2 h-4 w-4" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

