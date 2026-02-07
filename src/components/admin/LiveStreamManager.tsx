/**
 * Live Stream Manager Component
 *
 * Admin interface for creating and managing live streams
 */

import { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Radio,
  Copy,
  CheckCircle,
  XCircle,
  Play,
  StopCircle,
  Eye,
  Users,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { createLiveStream, getLiveStream } from "@/lib/mux/api";
import { db } from "@/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";

interface LiveStreamManagerProps {
  onSuccess?: () => void;
}

export function LiveStreamManager({ onSuccess }: LiveStreamManagerProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [streamData, setStreamData] = useState<{
    id: string;
    streamKey: string;
    playbackId: string;
    status: string;
  }>();

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    accessLevel: "public" as "public" | "members_only" | "tier_specific",
    recordingEnabled: true,
    scheduledStartTime: "",
  });

  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const copyToClipboard = async (text: string, type: "key" | "url") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "key") {
        setCopiedKey(true);
        setTimeout(() => setCopiedKey(false), 2000);
      } else {
        setCopiedUrl(true);
        setTimeout(() => setCopiedUrl(false), 2000);
      }
      toast.success("Copied to clipboard");
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  const handleCreateStream = async () => {
    if (!user || !formData.title) return;

    try {
      setLoading(true);

      // Create Mux live stream
      const stream = await createLiveStream({
        title: formData.title,
        description: formData.description,
        accessLevel: formData.accessLevel,
        recordingEnabled: formData.recordingEnabled,
      });

      // Save to Firestore
      const streamDoc = await addDoc(collection(db, "live_streams"), {
        title: formData.title,
        slug: formData.title.toLowerCase().replace(/\s+/g, "-"),
        description: formData.description,
        muxStreamId: stream.streamId,
        muxStreamKey: stream.streamKey,
        muxPlaybackId: stream.playbackId,
        status: "idle",
        accessLevel: formData.accessLevel,
        recordingEnabled: formData.recordingEnabled,
        scheduledStartTime: formData.scheduledStartTime
          ? Timestamp.fromDate(new Date(formData.scheduledStartTime))
          : null,
        maxConcurrentViewers: 0,
        totalViewers: 0,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      setStreamData({
        id: stream.streamId,
        streamKey: stream.streamKey,
        playbackId: stream.playbackId,
        status: "idle",
      });

      toast.success("Live stream created successfully!");
      onSuccess?.();
    } catch (error) {
      console.error("Error creating live stream:", error);
      toast.error("Failed to create live stream");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      accessLevel: "public",
      recordingEnabled: true,
      scheduledStartTime: "",
    });
    setStreamData(undefined);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) setTimeout(resetForm, 300);
      }}
    >
      <DialogTrigger asChild>
        <Button className="gap-2" variant="outline">
          <Radio className="h-4 w-4" />
          Create Live Stream
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Live Stream</DialogTitle>
          <DialogDescription>
            Set up a new live stream with Mux
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {!streamData ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="stream-title">Stream Title *</Label>
                <Input
                  id="stream-title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g., Weekly Impact Update"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="stream-description">Description</Label>
                <Textarea
                  id="stream-description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe your live stream"
                  rows={3}
                />
              </div>

              {/* Scheduled Start Time */}
              <div className="space-y-2">
                <Label htmlFor="scheduled-time">
                  Scheduled Start Time (Optional)
                </Label>
                <Input
                  id="scheduled-time"
                  type="datetime-local"
                  value={formData.scheduledStartTime}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      scheduledStartTime: e.target.value,
                    })
                  }
                />
              </div>

              {/* Access Level */}
              <div className="space-y-2">
                <Label htmlFor="stream-access">Access Level</Label>
                <Select
                  value={formData.accessLevel}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, accessLevel: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="members_only">Members Only</SelectItem>
                    <SelectItem value="tier_specific">Tier Specific</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Recording */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="recording">Enable Recording</Label>
                  <p className="text-sm text-muted-foreground">
                    Save stream for replay after broadcast
                  </p>
                </div>
                <Switch
                  id="recording"
                  checked={formData.recordingEnabled}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, recordingEnabled: checked })
                  }
                />
              </div>

              {/* Submit */}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateStream}
                  disabled={!formData.title || loading}
                  className="gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Radio className="h-4 w-4" />
                      Create Stream
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="stream-info"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              {/* Success Header */}
              <div className="text-center py-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring" }}
                >
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                </motion.div>
                <h3 className="text-xl font-semibold">Live Stream Created!</h3>
                <p className="text-sm text-muted-foreground">
                  Use these credentials to start broadcasting
                </p>
              </div>

              {/* Stream Info Cards */}
              <div className="grid gap-4">
                {/* RTMP URL */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">
                      RTMP URL
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Input
                        readOnly
                        value="rtmps://global-live.mux.com:443/app"
                        className="font-mono text-sm"
                      />
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() =>
                          copyToClipboard(
                            "rtmps://global-live.mux.com:443/app",
                            "url",
                          )
                        }
                      >
                        {copiedUrl ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Stream Key */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      Stream Key
                      <Badge variant="destructive" className="text-xs">
                        Secret
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Input
                        readOnly
                        type="password"
                        value={streamData.streamKey}
                        className="font-mono text-sm"
                      />
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() =>
                          copyToClipboard(streamData.streamKey, "key")
                        }
                      >
                        {copiedKey ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Keep this key private! Anyone with it can stream to your
                      account.
                    </p>
                  </CardContent>
                </Card>

                {/* Playback ID */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">
                      Playback ID
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Input
                      readOnly
                      value={streamData.playbackId}
                      className="font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Viewers will use this to watch your stream
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Setup Instructions */}
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-sm">Setup Instructions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium mb-1">
                      1. Open your streaming software
                    </p>
                    <p className="text-muted-foreground">
                      OBS Studio, Streamlabs, or any RTMP-compatible software
                    </p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">
                      2. Configure stream settings
                    </p>
                    <p className="text-muted-foreground">
                      Enter the RTMP URL as your server and the Stream Key as
                      your key
                    </p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">3. Start streaming</p>
                    <p className="text-muted-foreground">
                      Click "Start Streaming" in your software. The stream will
                      go live automatically!
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Done
                </Button>
                <Button
                  onClick={() => {
                    window.open(`/admin/livestream/${streamData.id}`, "_blank");
                  }}
                  className="gap-2"
                >
                  <Eye className="h-4 w-4" />
                  View Stream Page
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
