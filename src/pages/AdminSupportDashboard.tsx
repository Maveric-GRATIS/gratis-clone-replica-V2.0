import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Ticket,
  TicketMessage,
  TicketStats,
  CannedResponse,
} from "@/types/support";
import {
  Search,
  Filter,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  User,
  Calendar,
  Star,
  Send,
  MoreVertical,
  UserPlus,
  Archive,
  Trash2,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

export default function AdminSupportDashboard() {
  const [selectedTicket, setSelectedTicket] = useState<Partial<Ticket> | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [replyText, setReplyText] = useState("");

  // Mock data - replace with actual API calls
  const stats: TicketStats = {
    total: 245,
    open: 18,
    inProgress: 12,
    waitingCustomer: 8,
    resolved: 187,
    closed: 20,
    resolvedToday: 5,
    avgResponseTime: 2.5,
    avgResolutionTime: 24,
    satisfactionRate: 4.6,
  };

  const tickets: Partial<Ticket>[] = [
    {
      id: "T-001",
      userId: "user123",
      userName: "John Doe",
      userEmail: "john@example.com",
      subject: "Cannot process donation",
      description:
        "I'm trying to donate to the Water For Life project but getting an error at checkout.",
      category: "donation",
      status: "open",
      priority: "high",
      assignedTo: null,
      tags: ["payment", "urgent"],
      createdAt: new Date("2024-01-15T10:30:00"),
      updatedAt: new Date("2024-01-15T10:30:00"),
    },
    {
      id: "T-002",
      userId: "user456",
      userName: "Jane Smith",
      userEmail: "jane@example.com",
      subject: "Partnership inquiry",
      description:
        "I represent an NGO and would like to discuss partnership opportunities.",
      category: "partnership",
      status: "in_progress",
      priority: "medium",
      assignedTo: "agent001",
      assignedToName: "Sarah Johnson",
      tags: ["partnership", "ngo"],
      createdAt: new Date("2024-01-14T14:20:00"),
      updatedAt: new Date("2024-01-15T09:00:00"),
      firstResponseAt: new Date("2024-01-14T15:00:00"),
    },
    {
      id: "T-003",
      userId: "user789",
      userName: "Mike Wilson",
      userEmail: "mike@example.com",
      subject: "Order status question",
      description: "What's the status of my recent order #12345?",
      category: "order",
      status: "waiting_customer",
      priority: "low",
      assignedTo: "agent002",
      assignedToName: "Tom Brown",
      tags: ["order"],
      createdAt: new Date("2024-01-13T09:15:00"),
      updatedAt: new Date("2024-01-14T16:30:00"),
      firstResponseAt: new Date("2024-01-13T10:00:00"),
    },
  ];

  const cannedResponses: Partial<CannedResponse>[] = [
    {
      id: "cr001",
      title: "Thank you for contacting",
      content:
        "Thank you for contacting GRATIS support. We've received your inquiry and will respond within 24 hours.",
      category: "technical",
    },
    {
      id: "cr002",
      title: "Payment issue resolution",
      content:
        "We're sorry to hear you're experiencing payment issues. Please try the following steps:\n1. Clear your browser cache\n2. Try a different payment method\n3. Check if your card has sufficient funds",
      category: "billing",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "destructive";
      case "in_progress":
        return "default";
      case "waiting_customer":
        return "secondary";
      case "resolved":
        return "outline";
      case "closed":
        return "outline";
      default:
        return "default";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "text-red-600 bg-red-50";
      case "high":
        return "text-orange-600 bg-orange-50";
      case "medium":
        return "text-blue-600 bg-blue-50";
      case "low":
        return "text-gray-600 bg-gray-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const handleAssignTicket = (ticketId: string, agentId: string) => {
    console.log("Assigning ticket", ticketId, "to agent", agentId);
    // Implement actual assignment logic
  };

  const handleSendReply = () => {
    if (!selectedTicket || !replyText.trim()) return;
    console.log("Sending reply to ticket", selectedTicket.id, ":", replyText);
    setReplyText("");
    // Implement actual reply logic
  };

  const handleCloseTicket = (ticketId: string) => {
    console.log("Closing ticket", ticketId);
    // Implement actual close logic
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.userName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || ticket.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || ticket.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Support Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Manage customer support tickets and inquiries
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Open Tickets
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.open}</div>
              <p className="text-xs text-gray-600 mt-1">
                +2 from yesterday
                <TrendingUp className="inline h-3 w-3 ml-1 text-green-600" />
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inProgress}</div>
              <p className="text-xs text-gray-600 mt-1">
                -3 from yesterday
                <TrendingDown className="inline h-3 w-3 ml-1 text-red-600" />
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Avg Response Time
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-cyan-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgResponseTime}h</div>
              <p className="text-xs text-gray-600 mt-1">Under SLA target</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Satisfaction Rate
              </CardTitle>
              <Star className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.satisfactionRate}/5.0
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Based on {stats.resolved} resolved tickets
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Ticket List */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tickets</CardTitle>
                <CardDescription>
                  Manage and respond to customer support requests
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search tickets..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[150px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="waiting_customer">Waiting</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={priorityFilter}
                    onValueChange={setPriorityFilter}
                  >
                    <SelectTrigger className="w-full sm:w-[150px]">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Ticket List */}
                <div className="space-y-3">
                  {filteredTickets.map((ticket) => (
                    <Card
                      key={ticket.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedTicket(ticket)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-mono text-sm text-gray-600">
                                {ticket.id}
                              </span>
                              <Badge variant={getStatusColor(ticket.status)}>
                                {ticket.status.replace("_", " ")}
                              </Badge>
                              <Badge
                                className={getPriorityColor(ticket.priority)}
                              >
                                {ticket.priority}
                              </Badge>
                            </div>
                            <h3 className="font-semibold text-lg mb-1">
                              {ticket.subject}
                            </h3>
                            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                              {ticket.description}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {ticket.userName}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {ticket.createdAt.toLocaleDateString()}
                              </span>
                              {ticket.assignedToName && (
                                <span className="flex items-center gap-1">
                                  <UserPlus className="h-3 w-3" />
                                  {ticket.assignedToName}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {filteredTickets.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No tickets found</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Ticket Details & Actions */}
          <div className="space-y-4">
            {selectedTicket ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Ticket Details</CardTitle>
                    <CardDescription>{selectedTicket.id}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-xs text-gray-600">Customer</Label>
                      <p className="font-medium">{selectedTicket.userName}</p>
                      <p className="text-sm text-gray-600">
                        {selectedTicket.userEmail}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600">Subject</Label>
                      <p className="font-medium">{selectedTicket.subject}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600">
                        Description
                      </Label>
                      <p className="text-sm">{selectedTicket.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-gray-600">
                          Category
                        </Label>
                        <p className="font-medium capitalize">
                          {selectedTicket.category}
                        </p>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-600">
                          Priority
                        </Label>
                        <Badge
                          className={getPriorityColor(selectedTicket.priority)}
                        >
                          {selectedTicket.priority}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Select
                      onValueChange={(agentId) =>
                        handleAssignTicket(selectedTicket.id, agentId)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Assign to agent..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="agent001">Sarah Johnson</SelectItem>
                        <SelectItem value="agent002">Tom Brown</SelectItem>
                        <SelectItem value="agent003">Emily Davis</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" className="w-full justify-start">
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Mark as Resolved
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Archive className="mr-2 h-4 w-4" />
                      Archive Ticket
                    </Button>
                    <Button
                      variant="destructive"
                      className="w-full justify-start"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Ticket
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Send Reply</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Use canned response..." />
                      </SelectTrigger>
                      <SelectContent>
                        {cannedResponses.map((response) => (
                          <SelectItem key={response.id} value={response.id}>
                            {response.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Textarea
                      placeholder="Type your reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={4}
                    />
                    <Button onClick={handleSendReply} className="w-full">
                      <Send className="mr-2 h-4 w-4" />
                      Send Reply
                    </Button>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="py-12 text-center text-gray-500">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a ticket to view details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
