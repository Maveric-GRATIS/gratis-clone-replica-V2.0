/**
 * Support Tickets Page
 * Part 8 - Section 38: Customer support ticket system
 */

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Plus,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
} from "lucide-react";
import type { Ticket, TicketCategory, TicketPriority } from "@/types/support";

const MOCK_TICKETS: Ticket[] = [
  {
    id: "1",
    ticketNumber: "TICKET-001",
    userId: "user123",
    userEmail: "user@example.com",
    userName: "John Doe",
    userType: "user",
    subject: "Issue with donation payment",
    description:
      "My payment failed but the amount was deducted from my account.",
    category: "billing",
    priority: "high",
    status: "in_progress",
    tags: ["payment", "urgent"],
    attachments: [],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: "2",
    ticketNumber: "TICKET-002",
    userId: "user123",
    userEmail: "user@example.com",
    userName: "John Doe",
    userType: "user",
    subject: "Question about bottle shipment",
    description:
      "When will my bottle order ship? It's been 3 days since I ordered.",
    category: "order",
    priority: "medium",
    status: "waiting_customer",
    tags: ["shipping"],
    attachments: [],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    firstResponseAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
  },
  {
    id: "3",
    ticketNumber: "TICKET-003",
    userId: "user123",
    userEmail: "user@example.com",
    userName: "John Doe",
    userType: "user",
    subject: "Great service!",
    description: "Just wanted to say thank you for the amazing work you do!",
    category: "feedback",
    priority: "low",
    status: "resolved",
    tags: ["positive"],
    attachments: [],
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
    resolvedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
    satisfactionRating: 5,
  },
];

export default function SupportTickets() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showNewTicketDialog, setShowNewTicketDialog] = useState(false);
  const [newTicket, setNewTicket] = useState({
    subject: "",
    description: "",
    category: "other" as TicketCategory,
    priority: "medium" as TicketPriority,
  });

  useEffect(() => {
    if (user) {
      setTickets(MOCK_TICKETS);
      setFilteredTickets(MOCK_TICKETS);
    }
  }, [user]);

  useEffect(() => {
    let filtered = tickets;

    if (searchQuery) {
      filtered = filtered.filter(
        (ticket) =>
          ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ticket.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          ticket.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((ticket) => ticket.status === statusFilter);
    }

    setFilteredTickets(filtered);
  }, [searchQuery, statusFilter, tickets]);

  const handleCreateTicket = () => {
    const ticket: Ticket = {
      id: `${tickets.length + 1}`,
      ticketNumber: `TICKET-${String(tickets.length + 1).padStart(3, "0")}`,
      userId: user?.uid || "",
      userEmail: user?.email || "",
      userName: user?.displayName || "User",
      userType: "user",
      ...newTicket,
      status: "open",
      tags: [],
      attachments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setTickets([ticket, ...tickets]);
    setShowNewTicketDialog(false);
    setNewTicket({
      subject: "",
      description: "",
      category: "other",
      priority: "medium",
    });
  };

  const getStatusBadge = (status: Ticket["status"]) => {
    const variants: Record<
      Ticket["status"],
      { variant: any; label: string; icon: any }
    > = {
      open: { variant: "default", label: "Open", icon: AlertCircle },
      in_progress: { variant: "secondary", label: "In Progress", icon: Clock },
      waiting_customer: {
        variant: "outline",
        label: "Waiting",
        icon: MessageSquare,
      },
      resolved: { variant: "default", label: "Resolved", icon: CheckCircle2 },
      closed: { variant: "outline", label: "Closed", icon: CheckCircle2 },
    };

    const config = variants[status];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getPriorityColor = (priority: TicketPriority) => {
    const colors = {
      low: "text-gray-500",
      medium: "text-blue-500",
      high: "text-orange-500",
      urgent: "text-red-500",
    };
    return colors[priority];
  };

  return (
    <div className="container max-w-6xl mx-auto px-4 pt-24 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Support Tickets</h1>
          <p className="text-muted-foreground">
            Manage your support requests and get help from our team
          </p>
        </div>
        <Dialog
          open={showNewTicketDialog}
          onOpenChange={setShowNewTicketDialog}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Ticket
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Support Ticket</DialogTitle>
              <DialogDescription>
                Describe your issue and we'll get back to you as soon as
                possible
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Brief description of your issue"
                  value={newTicket.subject}
                  onChange={(e) =>
                    setNewTicket({ ...newTicket, subject: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newTicket.category}
                  onValueChange={(value) =>
                    setNewTicket({
                      ...newTicket,
                      category: value as TicketCategory,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="account">Account</SelectItem>
                    <SelectItem value="billing">Billing</SelectItem>
                    <SelectItem value="donation">Donation</SelectItem>
                    <SelectItem value="order">Order</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                    <SelectItem value="feedback">Feedback</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={newTicket.priority}
                  onValueChange={(value) =>
                    setNewTicket({
                      ...newTicket,
                      priority: value as TicketPriority,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Please provide details about your issue..."
                  rows={6}
                  value={newTicket.description}
                  onChange={(e) =>
                    setNewTicket({ ...newTicket, description: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowNewTicketDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateTicket}
                disabled={!newTicket.subject || !newTicket.description}
              >
                Create Ticket
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tickets..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
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
          </div>
        </CardContent>
      </Card>

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No tickets found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Create your first support ticket to get help"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredTickets.map((ticket) => (
            <Card
              key={ticket.id}
              className="hover:border-primary/50 transition-colors cursor-pointer"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg">
                        {ticket.subject}
                      </CardTitle>
                      {getStatusBadge(ticket.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="font-mono">{ticket.ticketNumber}</span>
                      <span>•</span>
                      <span className="capitalize">{ticket.category}</span>
                      <span>•</span>
                      <span
                        className={`capitalize ${getPriorityColor(ticket.priority)}`}
                      >
                        {ticket.priority} priority
                      </span>
                      <span>•</span>
                      <span>
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {ticket.description}
                </p>
                {ticket.tags.length > 0 && (
                  <div className="flex gap-2 mt-3">
                    {ticket.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
