import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Package,
  ShoppingCart,
  Users,
  Video,
  Calendar,
  Megaphone,
  FileText,
  BarChart3,
} from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useAllProducts } from "@/hooks/useAllProducts";
import { Button } from "@/components/ui/button";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { products } = useAllProducts();

  const stats = [
    {
      title: "Total Products",
      value: products.length.toString(),
      description: "Active products",
      icon: Package,
      color: "text-blue-500",
    },
    {
      title: "Orders",
      value: "0",
      description: "This month",
      icon: ShoppingCart,
      color: "text-green-500",
    },
    {
      title: "Users",
      value: "0",
      description: "Registered",
      icon: Users,
      color: "text-purple-500",
    },
    {
      title: "Videos",
      value: "0",
      description: "Published",
      icon: Video,
      color: "text-red-500",
    },
  ];
}
