import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface CmsEditButtonProps {
  to: string;
  label: string;
}

export function CmsEditButton({ to, label }: CmsEditButtonProps) {
  return (
    <Button asChild variant="outline">
      <Link to={to}>{label}</Link>
    </Button>
  );
}
