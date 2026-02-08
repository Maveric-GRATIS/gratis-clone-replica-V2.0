import { useState } from "react";
import { Code, Play, BookOpen, Copy, Check } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const exampleQueries = {
  getDonations: `query GetRecentDonations {
  donations(limit: 10, orderBy: createdAt_DESC) {
    id
    amount
    currency
    donorEmail
    projectId
    createdAt
    project {
      id
      name
      category
    }
  }
}`,
  getProjects: `query GetActiveProjects {
  projects(where: { status: ACTIVE }) {
    id
    name
    description
    goalAmount
    currentAmount
    category
    ngoPartner {
      id
      name
    }
  }
}`,
  createDonation: `mutation CreateDonation($input: DonationInput!) {
  createDonation(input: $input) {
    id
    amount
    currency
    status
    receiptUrl
  }
}`,
  getUser: `query GetUser($id: ID!) {
  user(id: $id) {
    id
    email
    firstName
    lastName
    role
    createdAt
    donations {
      id
      amount
      createdAt
    }
  }
}`,
};

export default function GraphQLExplorer() {
  const [query, setQuery] = useState(exampleQueries.getDonations);
  const [variables, setVariables] = useState("{}");
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleExecute = async () => {
    setLoading(true);
    setResult("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock response based on query type
      let mockResponse;
      if (query.includes("GetRecentDonations")) {
        mockResponse = {
          data: {
            donations: [
              {
                id: "don_1",
                amount: 50.0,
                currency: "EUR",
                donorEmail: "donor@example.com",
                projectId: "proj_1",
                createdAt: "2024-02-08T10:00:00Z",
                project: {
                  id: "proj_1",
                  name: "Clean Water Initiative",
                  category: "WATER",
                },
              },
              {
                id: "don_2",
                amount: 100.0,
                currency: "EUR",
                donorEmail: "supporter@example.com",
                projectId: "proj_2",
                createdAt: "2024-02-08T09:30:00Z",
                project: {
                  id: "proj_2",
                  name: "School Building Program",
                  category: "EDUCATION",
                },
              },
            ],
          },
        };
      } else if (query.includes("GetActiveProjects")) {
        mockResponse = {
          data: {
            projects: [
              {
                id: "proj_1",
                name: "Clean Water Initiative",
                description: "Providing clean water to rural communities",
                goalAmount: 50000,
                currentAmount: 32450,
                category: "WATER",
                ngoPartner: {
                  id: "ngo_1",
                  name: "WaterAid Netherlands",
                },
              },
            ],
          },
        };
      } else if (query.includes("CreateDonation")) {
        mockResponse = {
          data: {
            createDonation: {
              id: "don_" + Date.now(),
              amount: 50.0,
              currency: "EUR",
              status: "COMPLETED",
              receiptUrl: "https://gratis.ngo/receipts/...",
            },
          },
        };
      } else {
        mockResponse = {
          data: null,
          errors: [
            {
              message:
                "This is a mock GraphQL endpoint. Connect to a real GraphQL server to execute queries.",
              extensions: {
                code: "MOCK_ENDPOINT",
              },
            },
          ],
        };
      }

      setResult(JSON.stringify(mockResponse, null, 2));
      toast.success("Query executed successfully");
    } catch (error) {
      setResult(
        JSON.stringify(
          { errors: [{ message: "Failed to execute query" }] },
          null,
          2,
        ),
      );
      toast.error("Failed to execute query");
    } finally {
      setLoading(false);
    }
  };

  const handleLoadExample = (exampleKey: keyof typeof exampleQueries) => {
    setQuery(exampleQueries[exampleKey]);
    setResult("");
    toast.success("Example loaded");
  };

  const handleCopyResult = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container mx-auto p-6 pt-24 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-500 rounded-xl">
            <Code className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">GraphQL Explorer</h1>
            <p className="text-muted-foreground">
              Test and explore the GRATIS GraphQL API
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            Mock Endpoint
          </Badge>
        </div>
      </div>

      {/* Info Card */}
      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-blue-600 mt-1" />
            <div>
              <p className="font-medium text-blue-900 dark:text-blue-100">
                About GraphQL Explorer
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                This is a mock GraphQL playground. In production, this would
                connect to your GraphQL server at{" "}
                <code className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">
                  https://api.gratis.ngo/graphql
                </code>
                . Load example queries below to see sample responses.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Query Editor */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Query Editor
              <Button size="sm" onClick={handleExecute} disabled={loading}>
                <Play className="h-4 w-4 mr-2" />
                {loading ? "Executing..." : "Execute"}
              </Button>
            </CardTitle>
            <CardDescription>
              Write your GraphQL query or mutation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter your GraphQL query..."
                className="font-mono text-sm min-h-[300px]"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Variables (JSON)
              </label>
              <Textarea
                value={variables}
                onChange={(e) => setVariables(e.target.value)}
                placeholder='{"id": "123"}'
                className="font-mono text-sm"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Response
              {result && (
                <Button size="sm" variant="outline" onClick={handleCopyResult}>
                  {copied ? (
                    <Check className="h-4 w-4 mr-2" />
                  ) : (
                    <Copy className="h-4 w-4 mr-2" />
                  )}
                  {copied ? "Copied!" : "Copy"}
                </Button>
              )}
            </CardTitle>
            <CardDescription>Query execution results</CardDescription>
          </CardHeader>
          <CardContent>
            {result ? (
              <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-[400px] text-sm">
                <code>{result}</code>
              </pre>
            ) : (
              <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                <div className="text-center">
                  <Code className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Execute a query to see results</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Example Queries */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Example Queries
          </CardTitle>
          <CardDescription>
            Load pre-built example queries to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="queries">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="queries">Queries</TabsTrigger>
              <TabsTrigger value="mutations">Mutations</TabsTrigger>
            </TabsList>

            <TabsContent value="queries" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <Card
                  className="cursor-pointer hover:border-primary transition-colors"
                  onClick={() => handleLoadExample("getDonations")}
                >
                  <CardHeader>
                    <CardTitle className="text-base">
                      Get Recent Donations
                    </CardTitle>
                    <CardDescription>
                      Fetch the 10 most recent donations with project details
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                      <code>{exampleQueries.getDonations}</code>
                    </pre>
                  </CardContent>
                </Card>

                <Card
                  className="cursor-pointer hover:border-primary transition-colors"
                  onClick={() => handleLoadExample("getProjects")}
                >
                  <CardHeader>
                    <CardTitle className="text-base">
                      Get Active Projects
                    </CardTitle>
                    <CardDescription>
                      Query all active projects with NGO partner info
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                      <code>{exampleQueries.getProjects}</code>
                    </pre>
                  </CardContent>
                </Card>

                <Card
                  className="cursor-pointer hover:border-primary transition-colors"
                  onClick={() => handleLoadExample("getUser")}
                >
                  <CardHeader>
                    <CardTitle className="text-base">
                      Get User Details
                    </CardTitle>
                    <CardDescription>
                      Fetch user information with donation history
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                      <code>{exampleQueries.getUser}</code>
                    </pre>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="mutations" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <Card
                  className="cursor-pointer hover:border-primary transition-colors"
                  onClick={() => handleLoadExample("createDonation")}
                >
                  <CardHeader>
                    <CardTitle className="text-base">Create Donation</CardTitle>
                    <CardDescription>
                      Process a new donation with mutation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                      <code>{exampleQueries.createDonation}</code>
                    </pre>
                    <div className="mt-3">
                      <p className="text-sm font-medium mb-2">
                        Example Variables:
                      </p>
                      <pre className="bg-muted p-3 rounded text-xs">
                        <code>
                          {JSON.stringify(
                            {
                              input: {
                                amount: 50.0,
                                currency: "EUR",
                                projectId: "proj_1",
                                donorEmail: "donor@example.com",
                              },
                            },
                            null,
                            2,
                          )}
                        </code>
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Schema Documentation */}
      <Card>
        <CardHeader>
          <CardTitle>Available Types</CardTitle>
          <CardDescription>
            Core GraphQL types in the GRATIS API
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-mono font-bold mb-2">type Donation</h4>
              <pre className="text-sm text-muted-foreground">
                {`  id: ID!
  amount: Float!
  currency: String!
  donorEmail: String
  projectId: ID!
  status: DonationStatus!
  createdAt: DateTime!
  project: Project`}
              </pre>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-mono font-bold mb-2">type Project</h4>
              <pre className="text-sm text-muted-foreground">
                {`  id: ID!
  name: String!
  description: String!
  goalAmount: Float!
  currentAmount: Float!
  category: ProjectCategory!
  status: ProjectStatus!
  ngoPartner: NGO`}
              </pre>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-mono font-bold mb-2">type User</h4>
              <pre className="text-sm text-muted-foreground">
                {`  id: ID!
  email: String!
  firstName: String
  lastName: String
  role: UserRole!
  createdAt: DateTime!
  donations: [Donation!]!`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
