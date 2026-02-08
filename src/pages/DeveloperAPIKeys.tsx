import React, { useState, useEffect } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Key,
  Plus,
  Copy,
  Eye,
  EyeOff,
  Trash2,
  RefreshCw,
  Globe,
  Shield,
  Clock,
  Activity,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import type { APIKey, APIKeyScope, APIKeyEnvironment } from "@/types/api-keys";
import { toast } from "sonner";

// Mock data for demonstration
const mockAPIKeys: APIKey[] = [
  {
    id: "key_1",
    name: "Production API",
    keyPrefix: "gratis_pk_AbCd1234",
    keyHash: "hash123",
    userId: "user123",
    status: "active",
    environment: "production",
    scopes: ["read", "write"],
    rateLimit: 300,
    allowedOrigins: ["https://myapp.com"],
    allowedIPs: [],
    usageCount: 1543,
    lastUsedAt: "2026-02-08T10:30:00Z",
    createdAt: "2026-01-15T08:00:00Z",
    updatedAt: "2026-02-08T10:30:00Z",
  },
  {
    id: "key_2",
    name: "Sandbox Testing",
    keyPrefix: "gratis_sk_XyZ98765",
    keyHash: "hash456",
    userId: "user123",
    status: "active",
    environment: "sandbox",
    scopes: ["read"],
    rateLimit: 60,
    allowedOrigins: ["http://localhost:3000"],
    allowedIPs: [],
    usageCount: 234,
    lastUsedAt: "2026-02-07T14:20:00Z",
    createdAt: "2026-02-01T12:00:00Z",
    updatedAt: "2026-02-07T14:20:00Z",
  },
];

export default function DeveloperAPIKeys() {
  const [apiKeys, setApiKeys] = useState<APIKey[]>(mockAPIKeys);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newKeyData, setNewKeyData] = useState<{
    name: string;
    environment: APIKeyEnvironment;
    scopes: APIKeyScope[];
    rateLimit: number;
    allowedOrigins: string;
    expiresInDays: number;
  }>({
    name: "",
    environment: "sandbox",
    scopes: ["read"],
    rateLimit: 60,
    allowedOrigins: "",
    expiresInDays: 0,
  });
  const [createdKey, setCreatedKey] = useState<string | null>(null);

  const handleCreateKey = () => {
    // Mock key creation
    const fullKey = `gratis_${newKeyData.environment === "production" ? "pk" : "sk"}_${Math.random().toString(36).slice(2, 10)}${Math.random().toString(36).slice(2, 10)}`;

    const newKey: APIKey = {
      id: `key_${Date.now()}`,
      name: newKeyData.name,
      keyPrefix: fullKey.slice(0, 20),
      keyHash: "hash_mock",
      userId: "user123",
      status: "active",
      environment: newKeyData.environment,
      scopes: newKeyData.scopes,
      rateLimit: newKeyData.rateLimit,
      allowedOrigins: newKeyData.allowedOrigins
        ? newKeyData.allowedOrigins.split(",").map((o) => o.trim())
        : [],
      allowedIPs: [],
      usageCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setApiKeys([newKey, ...apiKeys]);
    setCreatedKey(fullKey);

    toast.success("API key created successfully");
  };

  const handleRevokeKey = (keyId: string) => {
    setApiKeys(
      apiKeys.map((key) =>
        key.id === keyId ? { ...key, status: "revoked" as const } : key,
      ),
    );
    toast.success("API key revoked");
  };

  const handleCopyKey = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const getStatusColor = (status: APIKey["status"]) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-700";
      case "revoked":
        return "bg-red-100 text-red-700";
      case "expired":
        return "bg-gray-100 text-gray-700";
    }
  };

  const getEnvBadge = (env: APIKeyEnvironment) => {
    return env === "production" ? (
      <Badge className="bg-purple-100 text-purple-700">Production</Badge>
    ) : (
      <Badge className="bg-blue-100 text-blue-700">Sandbox</Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-950 dark:to-purple-950 pt-24 pb-12 px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-500 rounded-xl">
              <Key className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                API Keys
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your API keys for accessing the GRATIS API
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Keys</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {apiKeys.length}
                  </p>
                </div>
                <Key className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Keys</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {apiKeys.filter((k) => k.status === "active").length}
                  </p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Requests</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {apiKeys
                      .reduce((sum, k) => sum + k.usageCount, 0)
                      .toLocaleString()}
                  </p>
                </div>
                <Activity className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Rate Limit</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {Math.max(...apiKeys.map((k) => k.rateLimit))}/min
                  </p>
                </div>
                <Clock className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Create Key Button */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Your API Keys
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage and monitor your API keys
            </p>
          </div>

          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2">
                <Plus className="w-4 h-4" />
                Create API Key
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New API Key</DialogTitle>
                <DialogDescription>
                  Generate a new API key for accessing the GRATIS API
                </DialogDescription>
              </DialogHeader>

              {createdKey ? (
                <div className="space-y-6">
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950 rounded-lg border border-emerald-200">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <p className="font-semibold text-emerald-900 dark:text-emerald-100">
                        API Key Created Successfully
                      </p>
                    </div>
                    <p className="text-sm text-emerald-700 dark:text-emerald-300 mb-4">
                      Make sure to copy your API key now. You won't be able to
                      see it again!
                    </p>
                    <div className="flex items-center gap-2 p-3 bg-white dark:bg-gray-900 rounded-md font-mono text-sm">
                      <code className="flex-1 break-all">{createdKey}</code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCopyKey(createdKey)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowCreateDialog(false);
                        setCreatedKey(null);
                        setNewKeyData({
                          name: "",
                          environment: "sandbox",
                          scopes: ["read"],
                          rateLimit: 60,
                          allowedOrigins: "",
                          expiresInDays: 0,
                        });
                      }}
                    >
                      Done
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="keyName">Key Name*</Label>
                      <Input
                        id="keyName"
                        placeholder="e.g., Production API"
                        value={newKeyData.name}
                        onChange={(e) =>
                          setNewKeyData({ ...newKeyData, name: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="environment">Environment*</Label>
                      <Select
                        value={newKeyData.environment}
                        onValueChange={(v: APIKeyEnvironment) =>
                          setNewKeyData({ ...newKeyData, environment: v })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sandbox">
                            Sandbox (Testing)
                          </SelectItem>
                          <SelectItem value="production">
                            Production (Live)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Scopes*</Label>
                      <div className="flex items-center gap-4 mt-2">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={newKeyData.scopes.includes("read")}
                            onChange={(e) => {
                              const scopes = e.target.checked
                                ? [...newKeyData.scopes, "read"]
                                : newKeyData.scopes.filter((s) => s !== "read");
                              setNewKeyData({
                                ...newKeyData,
                                scopes: scopes as APIKeyScope[],
                              });
                            }}
                          />
                          <span className="text-sm">Read</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={newKeyData.scopes.includes("write")}
                            onChange={(e) => {
                              const scopes = e.target.checked
                                ? [...newKeyData.scopes, "write"]
                                : newKeyData.scopes.filter(
                                    (s) => s !== "write",
                                  );
                              setNewKeyData({
                                ...newKeyData,
                                scopes: scopes as APIKeyScope[],
                              });
                            }}
                          />
                          <span className="text-sm">Write</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="rateLimit">
                        Rate Limit (requests/minute)
                      </Label>
                      <Input
                        id="rateLimit"
                        type="number"
                        min={10}
                        max={1000}
                        value={newKeyData.rateLimit}
                        onChange={(e) =>
                          setNewKeyData({
                            ...newKeyData,
                            rateLimit: parseInt(e.target.value) || 60,
                          })
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="origins">
                        Allowed Origins (comma-separated)
                      </Label>
                      <Input
                        id="origins"
                        placeholder="https://myapp.com, https://app.example.com"
                        value={newKeyData.allowedOrigins}
                        onChange={(e) =>
                          setNewKeyData({
                            ...newKeyData,
                            allowedOrigins: e.target.value,
                          })
                        }
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Leave empty to allow all origins
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowCreateDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateKey}
                      disabled={
                        !newKeyData.name || newKeyData.scopes.length === 0
                      }
                    >
                      Create API Key
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>

        {/* API Keys List */}
        <div className="grid grid-cols-1 gap-6">
          {apiKeys.map((key) => (
            <Card key={key.id} className="relative overflow-hidden">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle>{key.name}</CardTitle>
                      {getEnvBadge(key.environment)}
                      <Badge className={getStatusColor(key.status)}>
                        {key.status}
                      </Badge>
                    </div>
                    <CardDescription>
                      Created on {new Date(key.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {key.status === "active" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            toast.info(
                              "Key rotation would generate a new key here",
                            )
                          }
                        >
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRevokeKey(key.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Key Display */}
                  <div>
                    <Label className="text-xs text-gray-500">API Key</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-md text-sm font-mono">
                        {key.keyPrefix}••••••••••••••••
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCopyKey(key.keyPrefix)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-xs text-gray-500">Scopes</p>
                      <div className="flex gap-1 mt-1">
                        {key.scopes.map((scope) => (
                          <Badge
                            key={scope}
                            variant="outline"
                            className="text-xs"
                          >
                            {scope}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Rate Limit</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                        {key.rateLimit}/min
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Total Requests</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                        {key.usageCount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Last Used</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                        {key.lastUsedAt
                          ? new Date(key.lastUsedAt).toLocaleDateString()
                          : "Never"}
                      </p>
                    </div>
                  </div>

                  {/* Restrictions */}
                  {(key.allowedOrigins.length > 0 ||
                    key.allowedIPs.length > 0) && (
                    <div className="pt-4 border-t">
                      <p className="text-xs text-gray-500 mb-2">Restrictions</p>
                      <div className="space-y-2">
                        {key.allowedOrigins.length > 0 && (
                          <div className="flex items-center gap-2 text-sm">
                            <Globe className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">
                              {key.allowedOrigins.join(", ")}
                            </span>
                          </div>
                        )}
                        {key.allowedIPs.length > 0 && (
                          <div className="flex items-center gap-2 text-sm">
                            <Shield className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">
                              {key.allowedIPs.join(", ")}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Documentation Link */}
        <Card className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 border-purple-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  API Documentation
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Learn how to integrate with the GRATIS API
                </p>
              </div>
              <Button variant="outline">View Docs</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
