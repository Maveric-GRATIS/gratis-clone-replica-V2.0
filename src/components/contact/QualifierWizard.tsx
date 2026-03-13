import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export interface QualificationData {
  name: string;
  email: string;
  topic: string;
}

interface QualifierWizardProps {
  onComplete: (data: QualificationData) => void;
}

export function QualifierWizard({ onComplete }: QualifierWizardProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("general");

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Quick Intake</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
        <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" type="email" />
        <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Topic" />
        <Button
          onClick={() =>
            onComplete({
              name: name || "Guest",
              email: email || "guest@example.com",
              topic: topic || "general",
            })
          }
        >
          Continue
        </Button>
      </CardContent>
    </Card>
  );
}
