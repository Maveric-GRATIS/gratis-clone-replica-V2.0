/**
 * Video Transcript/Subtitles Manager Component
 *
 * Admin interface for uploading and managing video transcripts and subtitles
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  FileText,
  Upload,
  Trash2,
  CheckCircle,
  Languages,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { addSubtitles } from "@/lib/mux/api";
import { db, storage } from "@/firebase";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

interface Subtitle {
  id: string;
  languageCode: string;
  languageName: string;
  url: string;
  closedCaptions: boolean;
}

interface VideoTranscriptManagerProps {
  videoId: string;
  muxAssetId: string;
  existingSubtitles?: Subtitle[];
  onSuccess?: () => void;
}

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "nl", name: "Nederlands" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "es", name: "Español" },
  { code: "it", name: "Italiano" },
  { code: "pt", name: "Português" },
  { code: "pl", name: "Polski" },
  { code: "ar", name: "العربية" },
  { code: "zh", name: "中文" },
  { code: "ja", name: "日本語" },
  { code: "ko", name: "한국어" },
];

export function VideoTranscriptManager({
  videoId,
  muxAssetId,
  existingSubtitles = [],
  onSuccess,
}: VideoTranscriptManagerProps) {
  const [open, setOpen] = useState(false);
  const [subtitles, setSubtitles] = useState<Subtitle[]>(existingSubtitles);
  const [uploading, setUploading] = useState(false);

  // New subtitle form
  const [newSubtitle, setNewSubtitle] = useState({
    languageCode: "en",
    file: null as File | null,
    closedCaptions: false,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.name.endsWith(".vtt") && !file.name.endsWith(".srt")) {
        toast.error("Please upload a .vtt or .srt file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      setNewSubtitle({ ...newSubtitle, file });
    }
  };

  const handleUploadSubtitle = async () => {
    if (!newSubtitle.file) {
      toast.error("Please select a subtitle file");
      return;
    }

    try {
      setUploading(true);

      // Upload file to Firebase Storage
      const storageRef = ref(
        storage,
        `subtitles/${videoId}/${newSubtitle.languageCode}.vtt`,
      );
      await uploadBytes(storageRef, newSubtitle.file);
      const fileUrl = await getDownloadURL(storageRef);

      // Add subtitle track to Mux
      const language = LANGUAGES.find(
        (lang) => lang.code === newSubtitle.languageCode,
      );

      await addSubtitles({
        assetId: muxAssetId,
        languageCode: newSubtitle.languageCode,
        name: language?.name || newSubtitle.languageCode,
        url: fileUrl,
        closedCaptions: newSubtitle.closedCaptions,
      });

      // Save to Firestore
      const subtitle: Subtitle = {
        id: `subtitle-${Date.now()}`,
        languageCode: newSubtitle.languageCode,
        languageName: language?.name || newSubtitle.languageCode,
        url: fileUrl,
        closedCaptions: newSubtitle.closedCaptions,
      };

      const videoRef = doc(db, "videos", videoId);
      await updateDoc(videoRef, {
        subtitles: arrayUnion(subtitle),
        updatedAt: new Date(),
      });

      setSubtitles([...subtitles, subtitle]);
      setNewSubtitle({ languageCode: "en", file: null, closedCaptions: false });

      toast.success("Subtitle uploaded successfully!");
      onSuccess?.();
    } catch (error) {
      console.error("Error uploading subtitle:", error);
      toast.error("Failed to upload subtitle");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveSubtitle = async (id: string) => {
    try {
      const updatedSubtitles = subtitles.filter((sub) => sub.id !== id);
      setSubtitles(updatedSubtitles);

      const videoRef = doc(db, "videos", videoId);
      await updateDoc(videoRef, {
        subtitles: updatedSubtitles,
        updatedAt: new Date(),
      });

      toast.success("Subtitle removed");
    } catch (error) {
      console.error("Error removing subtitle:", error);
      toast.error("Failed to remove subtitle");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <FileText className="h-4 w-4" />
          Manage Subtitles
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Video Subtitles & Transcripts</DialogTitle>
          <DialogDescription>
            Upload .vtt or .srt files for multiple languages
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
          {/* Upload New Subtitle */}
          <div className="space-y-4 p-4 rounded-lg border bg-card">
            <Label>Upload New Subtitle</Label>

            {/* Language Selection */}
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select
                value={newSubtitle.languageCode}
                onValueChange={(value) =>
                  setNewSubtitle({ ...newSubtitle, languageCode: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <div className="flex items-center gap-2">
                        <Languages className="h-3 w-3" />
                        {lang.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label htmlFor="subtitle-file">Subtitle File</Label>
              <Input
                id="subtitle-file"
                type="file"
                accept=".vtt,.srt"
                onChange={handleFileChange}
              />
              {newSubtitle.file && (
                <Badge variant="secondary" className="gap-2">
                  <FileText className="h-3 w-3" />
                  {newSubtitle.file.name}
                </Badge>
              )}
              <p className="text-xs text-muted-foreground">
                Supports .vtt and .srt formats. Max 5MB.
              </p>
            </div>

            {/* Closed Captions */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="cc">Closed Captions</Label>
                <p className="text-xs text-muted-foreground">
                  For hearing impaired (includes sound effects)
                </p>
              </div>
              <Switch
                id="cc"
                checked={newSubtitle.closedCaptions}
                onCheckedChange={(checked) =>
                  setNewSubtitle({ ...newSubtitle, closedCaptions: checked })
                }
              />
            </div>

            {/* Upload Button */}
            <Button
              onClick={handleUploadSubtitle}
              disabled={!newSubtitle.file || uploading}
              className="w-full gap-2"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Upload Subtitle
                </>
              )}
            </Button>
          </div>

          {/* Existing Subtitles */}
          <div className="space-y-2">
            <Label>Existing Subtitles ({subtitles.length})</Label>
            <AnimatePresence mode="popLayout">
              {subtitles.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8 text-muted-foreground"
                >
                  <Languages className="h-12 w-12 mx-auto mb-2 opacity-20" />
                  <p>No subtitles yet. Upload your first subtitle above!</p>
                </motion.div>
              ) : (
                <div className="space-y-2">
                  {subtitles.map((subtitle) => (
                    <motion.div
                      key={subtitle.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <Languages className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="font-medium">
                          {subtitle.languageName}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {subtitle.languageCode}
                          {subtitle.closedCaptions && " • Closed Captions"}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveSubtitle(subtitle.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Info Box */}
          <div className="p-4 rounded-lg bg-muted/50 space-y-2">
            <div className="flex items-start gap-2">
              <FileText className="h-5 w-5 text-hot-lime mt-0.5" />
              <div className="space-y-1 text-sm">
                <p className="font-medium">Subtitle Format Tips</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Use WebVTT (.vtt) format for best compatibility</li>
                  <li>Include speaker labels for clarity</li>
                  <li>Keep lines short (max 42 characters)</li>
                  <li>Time captions to match speech rhythm</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end pt-4 border-t">
          <Button onClick={() => setOpen(false)}>Done</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
