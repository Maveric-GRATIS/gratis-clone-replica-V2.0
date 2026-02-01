/**
 * Video Chapters Editor Component
 *
 * Admin interface for adding chapters/timestamps to videos
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Plus,
  Trash2,
  Save,
  GripVertical,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import { db } from "@/firebase";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";

interface VideoChapter {
  startTime: number; // seconds
  title: string;
  id: string;
}

interface VideoChaptersEditorProps {
  videoId: string;
  existingChapters?: VideoChapter[];
  videoDuration: number;
  onSuccess?: () => void;
}

export function VideoChaptersEditor({
  videoId,
  existingChapters = [],
  videoDuration,
  onSuccess,
}: VideoChaptersEditorProps) {
  const [open, setOpen] = useState(false);
  const [chapters, setChapters] = useState<VideoChapter[]>(existingChapters);
  const [newChapter, setNewChapter] = useState({
    title: "",
    minutes: "",
    seconds: "",
  });
  const [saving, setSaving] = useState(false);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const parseTimeToSeconds = (minutes: string, seconds: string): number => {
    const mins = parseInt(minutes) || 0;
    const secs = parseInt(seconds) || 0;
    return mins * 60 + secs;
  };

  const handleAddChapter = () => {
    if (!newChapter.title) {
      toast.error("Please enter a chapter title");
      return;
    }

    const startTime = parseTimeToSeconds(
      newChapter.minutes,
      newChapter.seconds,
    );

    if (startTime >= videoDuration) {
      toast.error("Chapter time exceeds video duration");
      return;
    }

    // Check for duplicate timestamps
    if (chapters.some((ch) => ch.startTime === startTime)) {
      toast.error("A chapter already exists at this timestamp");
      return;
    }

    const chapter: VideoChapter = {
      id: `chapter-${Date.now()}`,
      title: newChapter.title,
      startTime,
    };

    // Add and sort chapters by time
    const updatedChapters = [...chapters, chapter].sort(
      (a, b) => a.startTime - b.startTime,
    );

    setChapters(updatedChapters);
    setNewChapter({ title: "", minutes: "", seconds: "" });
    toast.success("Chapter added");
  };

  const handleRemoveChapter = (id: string) => {
    setChapters(chapters.filter((ch) => ch.id !== id));
    toast.success("Chapter removed");
  };

  const handleSaveChapters = async () => {
    try {
      setSaving(true);

      // Save to Firestore
      const videoRef = doc(db, "videos", videoId);
      await updateDoc(videoRef, {
        chapters: chapters.map(({ id, ...rest }) => rest),
        updatedAt: new Date(),
      });

      toast.success("Chapters saved successfully!");
      onSuccess?.();
      setOpen(false);
    } catch (error) {
      console.error("Error saving chapters:", error);
      toast.error("Failed to save chapters");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Clock className="h-4 w-4" />
          Edit Chapters
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Video Chapters</DialogTitle>
          <DialogDescription>
            Add timestamps to help viewers navigate your video
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
          {/* Add New Chapter */}
          <div className="space-y-4">
            <Label>Add New Chapter</Label>
            <div className="flex gap-2">
              <div className="flex gap-1 items-center">
                <Input
                  type="number"
                  placeholder="MM"
                  value={newChapter.minutes}
                  onChange={(e) =>
                    setNewChapter({ ...newChapter, minutes: e.target.value })
                  }
                  className="w-16"
                  min="0"
                />
                <span className="text-muted-foreground">:</span>
                <Input
                  type="number"
                  placeholder="SS"
                  value={newChapter.seconds}
                  onChange={(e) =>
                    setNewChapter({ ...newChapter, seconds: e.target.value })
                  }
                  className="w-16"
                  min="0"
                  max="59"
                />
              </div>
              <Input
                placeholder="Chapter title"
                value={newChapter.title}
                onChange={(e) =>
                  setNewChapter({ ...newChapter, title: e.target.value })
                }
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddChapter();
                  }
                }}
              />
              <Button onClick={handleAddChapter} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Video duration: {formatTime(videoDuration)}
            </p>
          </div>

          {/* Chapters List */}
          <div className="space-y-2">
            <Label>Chapters ({chapters.length})</Label>
            <AnimatePresence mode="popLayout">
              {chapters.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8 text-muted-foreground"
                >
                  <Clock className="h-12 w-12 mx-auto mb-2 opacity-20" />
                  <p>No chapters yet. Add your first chapter above!</p>
                </motion.div>
              ) : (
                <div className="space-y-2">
                  {chapters.map((chapter, index) => (
                    <motion.div
                      key={chapter.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                      <Badge variant="secondary" className="font-mono">
                        {formatTime(chapter.startTime)}
                      </Badge>
                      <span className="flex-1 font-medium">
                        {chapter.title}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveChapter(chapter.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Preview */}
          {chapters.length > 0 && (
            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="p-4 rounded-lg bg-muted/50 space-y-1">
                {chapters.map((chapter) => (
                  <div
                    key={chapter.id}
                    className="text-sm flex items-center gap-2"
                  >
                    <span className="font-mono text-hot-lime">
                      {formatTime(chapter.startTime)}
                    </span>
                    <span className="text-muted-foreground">
                      {chapter.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveChapters}
            disabled={saving || chapters.length === 0}
            className="gap-2"
          >
            {saving ? (
              <>
                <Save className="h-4 w-4 animate-pulse" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Chapters
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
