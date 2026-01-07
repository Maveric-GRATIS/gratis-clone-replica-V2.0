import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction
}: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-6 flex items-center justify-center">
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">{description}</p>
        {actionLabel && (actionHref || onAction) && (
          actionHref ? (
            <Link to={actionHref}>
              <Button size="lg">{actionLabel}</Button>
            </Link>
          ) : (
            <Button size="lg" onClick={onAction}>{actionLabel}</Button>
          )
        )}
      </CardContent>
    </Card>
  );
}
