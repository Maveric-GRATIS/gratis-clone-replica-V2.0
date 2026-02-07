// src/pages/admin/FeatureFlagsManager.tsx
// Admin page for managing feature flags

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Flag, Plus, Power, Edit, Trash2, Search } from "lucide-react";
import { db } from "@/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import type { FeatureFlag } from "@/types/ab-testing";

export default function FeatureFlagsManager() {
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadFlags();
  }, []);

  const loadFlags = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, "feature_flags"),
        orderBy("updatedAt", "desc"),
      );
      const snap = await getDocs(q);
      const flagsData = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as FeatureFlag[];
      setFlags(flagsData);
    } catch (error) {
      console.error("Failed to load feature flags:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFlags = flags.filter(
    (flag) =>
      flag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flag.key.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <AdminLayout>
      <div className="pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Feature Flags
              </h1>
              <p className="text-muted-foreground">
                Control feature rollouts and experiments
              </p>
            </div>
            <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Flag
            </button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search flags..."
                className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-foreground"
              />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-card rounded-lg shadow-sm border border-border p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Total Flags
                </h3>
                <Flag className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-3xl font-bold text-foreground">
                {flags.length}
              </p>
            </div>
            <div className="bg-card rounded-lg shadow-sm border border-border p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Active
                </h3>
                <Power className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-foreground">
                {flags.filter((f) => f.enabled).length}
              </p>
            </div>
            <div className="bg-card rounded-lg shadow-sm border border-border p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Inactive
                </h3>
                <Power className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-3xl font-bold text-foreground">
                {flags.filter((f) => !f.enabled).length}
              </p>
            </div>
            <div className="bg-card rounded-lg shadow-sm border border-border p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  With Rules
                </h3>
                <Edit className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-foreground">
                {flags.filter((f) => f.rules && f.rules.length > 0).length}
              </p>
            </div>
          </div>

          {/* Flags Table */}
          <div className="bg-card rounded-lg shadow-sm border border-border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Flag
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Rules
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Last Updated
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-4 text-center text-muted-foreground"
                      >
                        Loading flags...
                      </td>
                    </tr>
                  ) : filteredFlags.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-4 text-center text-muted-foreground"
                      >
                        No flags found
                      </td>
                    </tr>
                  ) : (
                    filteredFlags.map((flag) => (
                      <tr key={flag.id} className="hover:bg-muted/50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-foreground">
                              {flag.name}
                            </div>
                            <div className="text-xs text-muted-foreground font-mono">
                              {flag.key}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              flag.enabled
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {flag.enabled ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {flag.rules?.length || 0} rules
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {new Date(flag.updatedAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button className="text-emerald-600 hover:text-emerald-700">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-700">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
