import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { QualificationData } from "@/components/contact/QualifierWizard";

interface AIChatProps {
  qualificationData: QualificationData;
  onRestart: () => void;
}

export function AIChat({ qualificationData, onRestart }: AIChatProps) {
  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>GRATIS Connect</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Thanks {qualificationData.name}. We received your topic: {qualificationData.topic}.
        </p>
        <p className="text-sm text-muted-foreground">
          Our team will contact you at {qualificationData.email}.
        </p>
        <Button variant="outline" onClick={onRestart}>
          Start Over
        </Button>
      </CardContent>
    </Card>
  );
}
