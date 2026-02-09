/**
 * Messaging Center
 *
 * Part 7 - Section 33: In-App Messaging System
 * Complete messaging interface for users and partners
 */

import { useState, useEffect, useRef } from "react";
import { format, isToday, isYesterday } from "date-fns";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MessageSquare,
  Send,
  Search,
  MoreVertical,
  Image as ImageIcon,
  Paperclip,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Conversation, Message } from "@/types/message";

// Mock data
const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "1",
    participants: [
      { id: "user1", type: "user", name: "John Doe", avatar: "" },
      {
        id: "partner1",
        type: "partner",
        name: "Water For Life Foundation",
        avatar: "",
      },
    ],
    participantIds: ["user1", "partner1"],
    lastMessage: {
      text: "Thank you for your donation! We will keep you updated on the project progress.",
      senderId: "partner1",
      sentAt: new Date(),
    },
    unreadCount: { user1: 1 },
    projectId: "project1",
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    participants: [
      { id: "user1", type: "user", name: "John Doe", avatar: "" },
      {
        id: "partner2",
        type: "partner",
        name: "Education First Initiative",
        avatar: "",
      },
    ],
    participantIds: ["user1", "partner2"],
    lastMessage: {
      text: "We have some exciting updates to share with you!",
      senderId: "partner2",
      sentAt: new Date(Date.now() - 86400000), // Yesterday
    },
    unreadCount: {},
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const MOCK_MESSAGES: Record<string, Message[]> = {
  "1": [
    {
      id: "m1",
      conversationId: "1",
      senderId: "user1",
      senderType: "user",
      content: {
        type: "text",
        text: "Hi! I just made a donation to your clean water project. Can you tell me more about it?",
      },
      readBy: ["user1", "partner1"],
      createdAt: new Date(Date.now() - 3600000),
    },
    {
      id: "m2",
      conversationId: "1",
      senderId: "partner1",
      senderType: "partner",
      content: {
        type: "text",
        text: "Thank you so much for your generous donation! We're currently working on installing 10 water wells in rural Kenya.",
      },
      readBy: ["user1", "partner1"],
      createdAt: new Date(Date.now() - 3000000),
    },
    {
      id: "m3",
      conversationId: "1",
      senderId: "partner1",
      senderType: "partner",
      content: {
        type: "text",
        text: "The project will provide clean drinking water to over 5.000 people in the Kisumu region.",
      },
      readBy: ["user1", "partner1"],
      createdAt: new Date(Date.now() - 2900000),
    },
    {
      id: "m4",
      conversationId: "1",
      senderId: "user1",
      senderType: "user",
      content: {
        type: "text",
        text: "That's amazing! How often will I receive updates on the progress?",
      },
      readBy: ["user1", "partner1"],
      createdAt: new Date(Date.now() - 1800000),
    },
    {
      id: "m5",
      conversationId: "1",
      senderId: "partner1",
      senderType: "partner",
      content: {
        type: "text",
        text: "Thank you for your donation! We will keep you updated on the project progress.",
      },
      readBy: ["partner1"],
      createdAt: new Date(),
    },
  ],
  "2": [
    {
      id: "m1",
      conversationId: "2",
      senderId: "partner2",
      senderType: "partner",
      content: {
        type: "text",
        text: "Hello! Thank you for your support. We have some exciting updates to share with you!",
      },
      readBy: ["user1", "partner2"],
      createdAt: new Date(Date.now() - 86400000),
    },
  ],
};

export default function MessagingCenter() {
  const currentUserId = "user1"; // Mock current user
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setConversations(MOCK_CONVERSATIONS);
      if (MOCK_CONVERSATIONS.length > 0) {
        setSelectedConversation(MOCK_CONVERSATIONS[0]);
      }
      setIsLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      setMessages(MOCK_MESSAGES[selectedConversation.id] || []);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || isSending) return;

    setIsSending(true);

    const message: Message = {
      id: `m${Date.now()}`,
      conversationId: selectedConversation.id,
      senderId: currentUserId,
      senderType: "user",
      content: { type: "text", text: newMessage },
      readBy: [currentUserId],
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");

    // Simulate API call
    setTimeout(() => {
      setIsSending(false);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatMessageDate = (date: Date) => {
    if (isToday(date)) return format(date, "HH:mm");
    if (isYesterday(date)) return "Yesterday " + format(date, "HH:mm");
    return format(date, "MMM d, HH:mm");
  };

  const getOtherParticipant = (conversation: Conversation) => {
    return conversation.participants.find((p) => p.id !== currentUserId);
  };

  const filteredConversations = conversations.filter((conv) => {
    const other = getOtherParticipant(conv);
    return other?.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Loading messages...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)]">
      <Card className="h-full flex overflow-hidden">
        {/* Conversations List */}
        <div className="w-80 border-r dark:border-gray-700 flex flex-col">
          <div className="p-4 border-b dark:border-gray-700">
            <h2 className="text-xl font-bold mb-3 dark:text-white">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-2">
              {filteredConversations.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    No conversations yet
                  </p>
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const other = getOtherParticipant(conv);
                  const unread = conv.unreadCount[currentUserId] || 0;
                  const isSelected = selectedConversation?.id === conv.id;

                  return (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedConversation(conv)}
                      className={cn(
                        "w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors",
                        isSelected
                          ? "bg-blue-50 dark:bg-blue-950/30"
                          : "hover:bg-gray-50 dark:hover:bg-gray-800",
                      )}
                    >
                      <Avatar className="w-12 h-12 flex-shrink-0">
                        <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                          {other?.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-sm dark:text-white truncate">
                            {other?.name}
                          </span>
                          {conv.lastMessage && (
                            <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                              {formatMessageDate(conv.lastMessage.sentAt)}
                            </span>
                          )}
                        </div>
                        {conv.lastMessage && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                            {conv.lastMessage.text}
                          </p>
                        )}
                        {unread > 0 && (
                          <Badge className="mt-1 bg-blue-600 text-white text-xs">
                            {unread} new
                          </Badge>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Messages Area */}
        {selectedConversation ? (
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                    {getOtherParticipant(selectedConversation)?.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold dark:text-white">
                    {getOtherParticipant(selectedConversation)?.name}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {getOtherParticipant(selectedConversation)?.type ===
                    "partner"
                      ? "NGO Partner"
                      : "Donor"}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => {
                  const isOwn = message.senderId === currentUserId;
                  return (
                    <div
                      key={message.id}
                      className={cn("flex gap-3", isOwn && "flex-row-reverse")}
                    >
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs">
                          {isOwn
                            ? "You"
                            : getOtherParticipant(
                                selectedConversation,
                              )?.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={cn("flex flex-col", isOwn && "items-end")}
                      >
                        <div
                          className={cn(
                            "max-w-md px-4 py-2 rounded-2xl",
                            isOwn
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white",
                          )}
                        >
                          <p className="text-sm">{message.content.text}</p>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {formatMessageDate(message.createdAt)}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t dark:border-gray-700">
              <div className="flex items-end gap-2">
                <Button variant="outline" size="icon" className="flex-shrink-0">
                  <ImageIcon className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="icon" className="flex-shrink-0">
                  <Paperclip className="w-5 h-5" />
                </Button>
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || isSending}
                  size="icon"
                  className="flex-shrink-0"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Press Enter to send, Shift + Enter for new line
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 dark:text-white">
                No conversation selected
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Choose a conversation from the list to start messaging
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
