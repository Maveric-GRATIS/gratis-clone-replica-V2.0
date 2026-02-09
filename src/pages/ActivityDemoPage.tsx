// ============================================================================
// GRATIS.NGO — Activity Timeline Demo Page
// ============================================================================

import React from "react";
import { Link } from "react-router-dom";
import { Home, ArrowLeft, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ActivityTimeline from "@/components/activity/ActivityTimeline";

export default function ActivityDemoPage() {
  return (
    <div className="min-h-screen bg-[#0f172a] pt-24 pb-12 px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-pink-500/10 border border-pink-500/30 rounded-xl">
                <Activity className="w-6 h-6 text-pink-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">
                  Activity Timeline
                </h1>
                <p className="text-gray-400">
                  Real-time feed of platform activities
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/part19-test">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 border-gray-600"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Tests
                </Button>
              </Link>
              <Link to="/">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 border-gray-600"
                >
                  <Home className="w-4 h-4" />
                  Home
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Feature Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gray-800/40 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-base">
                16 Activity Types
              </CardTitle>
              <CardDescription>
                Donations, projects, events, users & more
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-gray-800/40 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-base">
                Emoji Reactions
              </CardTitle>
              <CardDescription>
                Users can react to activities with emojis
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-gray-800/40 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-base">
                Pinned Activities
              </CardTitle>
              <CardDescription>
                Highlight important activities at the top
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Main Timeline */}
        <Card className="bg-gray-800/40 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Live Activity Feed</CardTitle>
            <CardDescription>
              Recent platform activities from all users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityTimeline
              visibility="public"
              limit={50}
              showFilters={true}
            />
          </CardContent>
        </Card>

        {/* Activity Types Reference */}
        <Card className="bg-gray-800/40 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Activity Types</CardTitle>
            <CardDescription>
              All supported activity types with icons
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { emoji: "💚", label: "Donation Received", color: "#10b981" },
                { emoji: "🔄", label: "Recurring Donation", color: "#3b82f6" },
                { emoji: "🚀", label: "Project Created", color: "#8b5cf6" },
                { emoji: "🎯", label: "Project Milestone", color: "#f59e0b" },
                { emoji: "✅", label: "Project Completed", color: "#22c55e" },
                { emoji: "📅", label: "Event Created", color: "#3b82f6" },
                { emoji: "🎟️", label: "Event Registration", color: "#06b6d4" },
                { emoji: "🤝", label: "Partner Joined", color: "#8b5cf6" },
                { emoji: "💸", label: "Partner Payout", color: "#f59e0b" },
                { emoji: "👋", label: "User Joined", color: "#ec4899" },
                { emoji: "🏆", label: "User Achievement", color: "#eab308" },
                { emoji: "❤️", label: "Tribe Signup", color: "#ef4444" },
                { emoji: "📝", label: "Content Published", color: "#6366f1" },
                { emoji: "💬", label: "Comment Posted", color: "#a855f7" },
                { emoji: "⚙️", label: "System Update", color: "#6b7280" },
                { emoji: "🎉", label: "Goal Reached", color: "#f59e0b" },
              ].map((type) => (
                <div
                  key={type.label}
                  className="flex items-center gap-2 p-3 bg-gray-900 border border-gray-700 rounded-lg"
                >
                  <span className="text-xl">{type.emoji}</span>
                  <span className="text-xs text-white">{type.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Implementation Details */}
        <Card className="bg-gray-800/40 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Implementation Details</CardTitle>
            <CardDescription>Technical overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 bg-gray-900 rounded-lg">
                <p className="text-gray-400 mb-1">Storage</p>
                <p className="text-white">
                  Firestore collection with realtime sync
                </p>
              </div>
              <div className="p-3 bg-gray-900 rounded-lg">
                <p className="text-gray-400 mb-1">Filtering</p>
                <p className="text-white">
                  By type, visibility, user, date range
                </p>
              </div>
              <div className="p-3 bg-gray-900 rounded-lg">
                <p className="text-gray-400 mb-1">Reactions</p>
                <p className="text-white">Emoji reactions with user tracking</p>
              </div>
              <div className="p-3 bg-gray-900 rounded-lg">
                <p className="text-gray-400 mb-1">Performance</p>
                <p className="text-white">Paginated queries, auto-refresh</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
