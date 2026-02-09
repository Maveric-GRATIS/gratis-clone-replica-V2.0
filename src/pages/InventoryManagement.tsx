/**
 * Part 10 - Section 49: Inventory Management System
 * Product catalog, stock levels, warehouses, purchase orders
 */

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Package,
  Warehouse,
  TrendingDown,
  TrendingUp,
  Search,
  Plus,
  AlertTriangle,
  CheckCircle2,
  FileText,
} from "lucide-react";

// Mock data
const products = [
  {
    id: "1",
    sku: "BTL-001",
    name: "Reusable Water Bottle - Blue",
    category: "bottle",
    status: "active",
    totalStock: 245,
    reserved: 12,
    available: 233,
    reorderPoint: 50,
    basePrice: 19.99,
  },
  {
    id: "2",
    sku: "MERCH-001",
    name: "GRATIS.NGO T-Shirt",
    category: "merchandise",
    status: "active",
    totalStock: 89,
    reserved: 5,
    available: 84,
    reorderPoint: 100,
    basePrice: 24.99,
  },
  {
    id: "3",
    sku: "BTL-002",
    name: "Insulated Bottle - Green",
    category: "bottle",
    status: "active",
    totalStock: 12,
    reserved: 8,
    available: 4,
    reorderPoint: 30,
    basePrice: 29.99,
  },
];

const warehouses = [
  {
    id: "1",
    name: "Main Warehouse",
    code: "WH-MAIN",
    city: "Amsterdam",
    type: "main",
    isActive: true,
  },
  {
    id: "2",
    name: "Fulfillment Center",
    code: "WH-FC-01",
    city: "Rotterdam",
    type: "fulfillment",
    isActive: true,
  },
];

const stockAlerts = [
  {
    id: "1",
    sku: "BTL-002",
    productName: "Insulated Bottle - Green",
    type: "low_stock",
    currentQuantity: 4,
    threshold: 30,
    warehouse: "Main Warehouse",
  },
  {
    id: "2",
    sku: "MERCH-001",
    productName: "GRATIS.NGO T-Shirt",
    type: "low_stock",
    currentQuantity: 84,
    threshold: 100,
    warehouse: "Main Warehouse",
  },
];

const purchaseOrders = [
  {
    id: "1",
    orderNumber: "PO-2026-000123",
    supplier: "EcoBottles Inc.",
    status: "approved",
    itemCount: 3,
    total: 2450.0,
    expectedDate: "2026-02-15",
  },
  {
    id: "2",
    orderNumber: "PO-2026-000124",
    supplier: "Green Merch Co.",
    status: "pending",
    itemCount: 2,
    total: 1890.0,
    expectedDate: "2026-02-20",
  },
];

export default function InventoryManagement() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-muted-foreground">
            Track products, stock levels, and warehouse operations
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">
              {products.filter((p) => p.status === "active").length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Stock Value
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€12.458</div>
            <p className="text-xs text-muted-foreground">
              Across all warehouses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stockAlerts.length}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warehouses</CardTitle>
            <Warehouse className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{warehouses.length}</div>
            <p className="text-xs text-muted-foreground">
              {warehouses.filter((w) => w.isActive).length} operational
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="alerts">Stock Alerts</TabsTrigger>
          <TabsTrigger value="warehouses">Warehouses</TabsTrigger>
          <TabsTrigger value="purchase-orders">Purchase Orders</TabsTrigger>
        </TabsList>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Product Inventory</CardTitle>
                  <CardDescription>
                    Manage products and stock levels
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 w-[300px]"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Package className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{product.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          SKU: {product.sku} • €{product.basePrice.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {product.available} available
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {product.reserved} reserved • {product.totalStock}{" "}
                          total
                        </div>
                      </div>

                      {product.available < product.reorderPoint ? (
                        <Badge variant="destructive">
                          <TrendingDown className="mr-1 h-3 w-3" />
                          Low Stock
                        </Badge>
                      ) : (
                        <Badge variant="default" className="bg-green-600">
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          In Stock
                        </Badge>
                      )}

                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stock Alerts Tab */}
        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stock Alerts</CardTitle>
              <CardDescription>
                Products requiring attention or restocking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stockAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-center justify-between p-4 border border-yellow-200 bg-yellow-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      <div>
                        <h4 className="font-semibold">{alert.productName}</h4>
                        <p className="text-sm text-muted-foreground">
                          SKU: {alert.sku} • {alert.warehouse}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-medium text-yellow-700">
                          {alert.currentQuantity} units remaining
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Reorder at {alert.threshold} units
                        </div>
                      </div>
                      <Button size="sm">Create PO</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Warehouses Tab */}
        <TabsContent value="warehouses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Warehouses</CardTitle>
              <CardDescription>
                Storage locations and fulfillment centers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {warehouses.map((warehouse) => (
                  <div
                    key={warehouse.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <Warehouse className="h-8 w-8 text-blue-600" />
                      <div>
                        <h4 className="font-semibold">{warehouse.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {warehouse.code} • {warehouse.city}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge>{warehouse.type}</Badge>
                      {warehouse.isActive && (
                        <Badge variant="default" className="bg-green-600">
                          Active
                        </Badge>
                      )}
                      <Button variant="outline" size="sm">
                        View Inventory
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Purchase Orders Tab */}
        <TabsContent value="purchase-orders" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Purchase Orders</CardTitle>
                  <CardDescription>
                    Track incoming inventory orders
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New PO
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {purchaseOrders.map((po) => (
                  <div
                    key={po.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <FileText className="h-8 w-8 text-purple-600" />
                      <div>
                        <h4 className="font-semibold">{po.orderNumber}</h4>
                        <p className="text-sm text-muted-foreground">
                          {po.supplier} • {po.itemCount} items
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          €{po.total.toFixed(2)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Expected: {po.expectedDate}
                        </div>
                      </div>
                      <Badge
                        variant={
                          po.status === "approved" ? "default" : "secondary"
                        }
                      >
                        {po.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
