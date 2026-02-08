// DeveloperKeys.tsx - API Key Management for Developers

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
  Trash2,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { apiKeyService } from "@/lib/api-keys/api-key-service";
import type { APIKey, APIKeyEnvironment, APIKeyScope } from "@/types/api-keys";
import { useToast } from "@/hooks/use-toast";

export default function DeveloperKeys() {
  const [keys, setKeys] = useState<APIKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  // Form state
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyType, setNewKeyType] = useState<APIKeyEnvironment>("sandbox");
  const [newKeyScopes, setNewKeyScopes] = useState<APIKeyScope[]>(["read"]);
  const [newKeyRateLimit, setNewKeyRateLimit] = useState("1000");

  useEffect(() => {
    loadKeys();
  }, []);

  const loadKeys = async () => {
    try {
      setLoading(true);
      // Mock data - API keys service not fully implemented yet
      const mockKeys: APIKey[] = [];
      setKeys(mockKeys);
    } catch (error) {
      console.error("Failed to load API keys:", error);
      toast({
        title: "Error",
        description: "Failed to load API keys",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a key name",
        variant: "destructive",
      });
      return;
    }

    try {
      // Mock implementation - create key functionality to be completed
      const mockKey = "gratis_pk_" + Math.random().toString(36).substr(2);
      setGeneratedKey(mockKey);
      await loadKeys();

      toast({
        title: "API Key Created",
        description: "Copy the key now - it won't be shown again",
      });
    } catch (error) {
      console.error("Failed to create API key:", error);
      toast({
        title: "Error",
        description: "Failed to create API key",
        variant: "destructive",
      });
    }
  };

  const handleRevokeKey = async (keyId: string, keyName: string) => {
    if (!confirm(`Are you sure you want to revoke "${keyName}"?`)) return;

    try {
      // Mock implementation - revoke functionality to be completed
      await loadKeys();
      toast({
        title: "Success",
        description: "API key revoked (mock)",
      });
    } catch (error) {
      console.error("Failed to revoke key:", error);
      toast({
        title: "Error",
        description: "Failed to revoke API key",
        variant: "destructive",
      });
    }
  };

  const handleRollKey = async (keyId: string, keyName: string) => {
    if (
      !confirm(`Roll "${keyName}"? The old key will be revoked after 24 hours.`)
    )
      return;

    try {
      // Mock implementation - roll functionality to be completed
      const mockNewKey = "gratis_pk_" + Math.random().toString(36).substr(2);
      setGeneratedKey(mockNewKey);
      await loadKeys();
      toast({
        title: "Key Rolled",
        description: "Old key will expire in 24 hours (mock)",
      });
    } catch (error) {
      console.error("Failed to roll key:", error);
      toast({
        title: "Error",
        description: "Failed to roll API key",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: `${label} copied to clipboard`,
    });
  };

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys((prev) => {
      const next = new Set(prev);
      if (next.has(keyId)) {
        next.delete(keyId);
      } else {
        next.add(keyId);
      }
      return next;
    });
  };

  const resetCreateForm = () => {
    setNewKeyName("");
    setNewKeyType("sandbox");
    setNewKeyScopes(["read"]);
    setNewKeyRateLimit("1000");
    setGeneratedKey(null);
    setCreateDialogOpen(false);
  };

  const toggleScope = (scope: APIKeyScope) => {
    setNewKeyScopes((prev) =>
      prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope],
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Key className="w-8 h-8" />
              API Keys
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage API keys for third-party integrations
            </p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Create Key
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Keys</CardDescription>
              <CardTitle className="text-3xl">{keys.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Active Keys</CardDescription>
              <CardTitle className="text-3xl">
                {keys.filter((k) => k.status === "active").length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Production Keys</CardDescription>
              <CardTitle className="text-3xl">
                {keys.filter((k) => k.environment === "production").length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Sandbox Keys</CardDescription>
              <CardTitle className="text-3xl">
                {keys.filter((k) => k.environment === "sandbox").length}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Keys List */}
        <Card>
          <CardHeader>
            <CardTitle>API Keys</CardTitle>
            <CardDescription>Manage your API credentials</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading keys...
              </div>
            ) : keys.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No API keys yet. Create one to get started.
              </div>
            ) : (
              <div className="space-y-4">
                {keys.map((key) => (
                  <div key={key.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{key.name}</h3>
                          <Badge
                            variant={
                              key.environment === "production"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {key.environment}
                          </Badge>
                          <Badge
                            variant={
                              key.status === "active"
                                ? "default"
                                : "destructive"
                            }
                          >
                            {key.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <code className="bg-muted px-2 py-1 rounded text-xs">
                            {visibleKeys.has(key.id!)
                              ? `${key.keyPrefix}••••••••`
                              : `${key.keyPrefix}••••••••••••••••••••••••`}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleKeyVisibility(key.id!)}
                          >
                            {visibleKeys.has(key.id!) ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRollKey(key.id!, key.name)}
                        >
                          Roll
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRevokeKey(key.id!, key.name)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="bg-muted px-2 py-1 rounded">
                        Scopes: {key.scopes.join(", ")}
                      </span>
                      <span className="bg-muted px-2 py-1 rounded">
                        Rate Limit: {key.rateLimit || "Unlimited"}/min
                      </span>
                      <span className="bg-muted px-2 py-1 rounded">
                        Created:{" "}
                        {key.createdAt
                          ? new Date(key.createdAt).toLocaleDateString()
                          : "N/A"}
                      </span>
                      {key.lastUsedAt && (
                        <span className="bg-muted px-2 py-1 rounded">
                          Last Used:{" "}
                          {new Date(key.lastUsedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create Dialog */}
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            {generatedKey ? (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    API Key Created
                  </DialogTitle>
                  <DialogDescription>
                    Copy this key now - it won't be shown again
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <p className="text-sm text-yellow-900 dark:text-yellow-100">
                      This key will only be shown once. Store it securely.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Your API Key</Label>
                    <div className="flex gap-2">
                      <Input
                        value={generatedKey}
                        readOnly
                        className="font-mono text-sm"
                      />
                      <Button
                        variant="outline"
                        onClick={() => copyToClipboard(generatedKey, "API key")}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={resetCreateForm}>Done</Button>
                </DialogFooter>
              </>
            ) : (
              <>
                <DialogHeader>
                  <DialogTitle>Create API Key</DialogTitle>
                  <DialogDescription>
                    Generate a new API key for integration
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Key Name *</Label>
                    <Input
                      id="name"
                      placeholder="My Integration Key"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Environment *</Label>
                    <Select
                      value={newKeyType}
                      onValueChange={(v) =>
                        setNewKeyType(v as APIKeyEnvironment)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sandbox">
                          Sandbox (Testing)
                        </SelectItem>
                        <SelectItem value="production">Production</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Scopes *</Label>
                    <div className="flex flex-wrap gap-2">
                      {(["read", "write", "admin"] as APIKeyScope[]).map(
                        (scope) => (
                          <Button
                            key={scope}
                            variant={
                              newKeyScopes.includes(scope)
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() => toggleScope(scope)}
                          >
                            {scope}
                          </Button>
                        ),
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rateLimit">
                      Rate Limit (requests/minute)
                    </Label>
                    <Input
                      id="rateLimit"
                      type="number"
                      value={newKeyRateLimit}
                      onChange={(e) => setNewKeyRateLimit(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCreateKey}>Create Key</Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
