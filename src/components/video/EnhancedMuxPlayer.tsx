/**
 * Enhanced Mux Video Player with Chapters and Subtitles
 *
 * Video player component with chapter navigation and subtitle support
 */

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MuxPlayer from "@mux/mux-player-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, List, FileText, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoChapter {
  startTime: number;
  title: string;
}

interface Subtitle {
  languageCode: string;
  languageName: string;
  url: string;
  closedCaptions: boolean;
}

interface EnhancedMuxPlayerProps {
  playbackId: string;
  title: string;
  poster?: string;
  chapters?: VideoChapter[];
  subtitles?: Subtitle[];
  autoPlay?: boolean;
  muted?: boolean;
}

export function EnhancedMuxPlayer({
  playbackId,
  title,
  poster,
  chapters = [],
  subtitles = [],
  autoPlay = false,
  muted = false,
}: EnhancedMuxPlayerProps) {
  const playerRef = useRef<any>(null);
  const [showChapters, setShowChapters] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSeekToChapter = (startTime: number) => {
    if (playerRef.current) {
      playerRef.current.currentTime = startTime;
    }
  };

  const getCurrentChapter = (): VideoChapter | undefined => {
    if (!chapters.length) return undefined;

    // Find the last chapter that has started
    for (let i = chapters.length - 1; i >= 0; i--) {
      if (currentTime >= chapters[i].startTime) {
        return chapters[i];
      }
    }

    return undefined;
  };

  const currentChapter = getCurrentChapter();

  return (
    <div className="space-y-4">
      {/* Video Player */}
      <div className="relative rounded-lg overflow-hidden">
        <MuxPlayer
          ref={playerRef}
          streamType="on-demand"
          playbackId={playbackId}
          metadata={{
            video_title: title,
          }}
          poster={poster}
          autoPlay={autoPlay}
          muted={muted}
          onTimeUpdate={(e: any) => setCurrentTime(e.target.currentTime)}
          accent-color="#C1FF00"
          primary-color="#FFFFFF"
          secondary-color="#0D0D0D"
          style={{
            width: "100%",
            aspectRatio: "16 / 9",
          }}
        >
          {/* Add subtitle tracks */}
          {subtitles.map((subtitle) => (
            <track
              key={subtitle.languageCode}
              label={subtitle.languageName}
              kind={subtitle.closedCaptions ? "captions" : "subtitles"}
              srcLang={subtitle.languageCode}
              src={subtitle.url}
            />
          ))}
        </MuxPlayer>

        {/* Current Chapter Overlay */}
        <AnimatePresence>
          {currentChapter && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-20 left-4 right-4 pointer-events-none"
            >
              <Badge
                variant="default"
                className="bg-jet-black/90 text-white backdrop-blur-sm px-4 py-2"
              >
                <Clock className="h-3 w-3 mr-2" />
                {currentChapter.title}
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Chapters List */}
      {chapters.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <button
              onClick={() => setShowChapters(!showChapters)}
              className="flex items-center justify-between w-full mb-3 group"
            >
              <div className="flex items-center gap-2">
                <List className="h-4 w-4" />
                <span className="font-semibold">
                  Chapters ({chapters.length})
                </span>
              </div>
              <ChevronRight
                className={cn(
                  "h-4 w-4 transition-transform",
                  showChapters && "rotate-90",
                )}
              />
            </button>

            <AnimatePresence>
              {showChapters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-1">
                      {chapters.map((chapter, index) => {
                        const isActive =
                          currentChapter?.startTime === chapter.startTime;

                        return (
                          <motion.button
                            key={index}
                            onClick={() =>
                              handleSeekToChapter(chapter.startTime)
                            }
                            className={cn(
                              "w-full flex items-start gap-3 p-3 rounded-lg text-left transition-all",
                              "hover:bg-accent",
                              isActive &&
                                "bg-hot-lime/10 border border-hot-lime/20",
                            )}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                          >
                            <Badge
                              variant={isActive ? "default" : "secondary"}
                              className={cn(
                                "font-mono shrink-0",
                                isActive && "bg-hot-lime text-jet-black",
                              )}
                            >
                              {formatTime(chapter.startTime)}
                            </Badge>
                            <div className="flex-1 min-w-0">
                              <p
                                className={cn(
                                  "font-medium",
                                  isActive && "text-hot-lime",
                                )}
                              >
                                {chapter.title}
                              </p>
                              {index < chapters.length - 1 && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {formatTime(
                                    chapters[index + 1].startTime -
                                      chapter.startTime,
                                  )}{" "}
                                  duration
                                </p>
                              )}
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      )}

      {/* Subtitles Info */}
      {subtitles.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>
                Available in {subtitles.length} language
                {subtitles.length !== 1 && "s"}:{" "}
                {subtitles.map((s) => s.languageName).join(", ")}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
