import React from "react";
import { useSelector } from "react-redux";
import { useGetInventoryItemsQuery } from "@/state/inventoryApi";
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Currency,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress"

const StatCard = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendLabel,
}) => {
  const isPositive = trend && trend > 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend !== undefined && (
          <div className="flex items-center space-x-1 text-xs mt-1">
            <TrendIcon
              className={`h-3 w-3 ${
                isPositive ? "text-green-500" : "text-red-500"
              }`}
            />
            <span className={isPositive ? "text-green-500" : "text-red-500"}>
              {Math.abs(trend)}%
            </span>
            <span className="text-muted-foreground">{trendLabel}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

function Dashboard() {
    // Fetch all inventory data from the backend
    const { data: inventoryData, isLoading, error } = useGetInventoryItemsQuery({
      page: 1,
      limit: 1000, // Fetch a large number
    });
    
    // Get items from the API response
    const items = inventoryData?.items || [];
  
    // Calculate values from the fetched data
    const totalItems = inventoryData?.total || 0;
    const lowStockItems = items.filter(
      (item) => item.status === "low-stock"
    ).length;
    const outOfStockItems = items.filter(
      (item) => item.status === "out-of-stock"
    ).length;
    const inStockItems = items.filter(
      (item) => item.status === "in-stock"
    ).length;
    const totalValue = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  
    const lowStockProducts = items
      .filter((item) => item.status === "low-stock")
      .slice(0, 5);
    const recentProducts = items.slice(0, 5);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-500">
              Error loading dashboard data: {error.message}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Products"
          value={totalItems.toString()}
          description="Active inventory items"
          icon={Package}
          trend={12}
          trendLabel="from last month"
        />
        <StatCard
          title="In Stock"
          value={inStockItems.toString()}
          description="Products available"
          icon={CheckCircle}
          trend={8}
          trendLabel="from last week"
        />
        <StatCard
          title="Inventory Value"
          value={`LKR ${totalValue.toLocaleString()}`}
          description="Total stock value"
          icon={Currency}
          trend={15}
          trendLabel="from last month"
        />
        <StatCard
          title="Stock Alerts"
          value={(lowStockItems + outOfStockItems).toString()}
          description="Items needing attention"
          icon={AlertTriangle}
          trend={-5}
          trendLabel="from yesterday"
        />
      </div>

      {/* Alerts */}
      {(lowStockItems > 0 || outOfStockItems > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <span>Inventory Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {lowStockItems > 0 && (
              <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">Low Stock Alert</span>
                </div>
                <Badge variant="secondary">{lowStockItems} items</Badge>
              </div>
            )}
            {outOfStockItems > 0 && (
              <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="text-sm">Out of Stock Alert</span>
                </div>
                <Badge variant="destructive">{outOfStockItems} items</Badge>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Products */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Products</CardTitle>
            <CardDescription>Latest added inventory items</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProducts.length > 0 ? (
                recentProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      {product.image && (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded-md"
                        />
                      )}
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          SKU: {product.sku}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">LKR {product.price.toFixed(2)}</p>
                      <Badge
                        variant={
                          product.status === "in-stock"
                            ? "default"
                            : product.status === "low-stock"
                            ? "outline"
                            : "destructive"
                        }
                      >
                        {product.status.replace("-", " ")}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="w-8 h-8 mx-auto mb-2" />
                  <p>No products added yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Items */}
        <Card>
          <CardHeader>
            <CardTitle>Low Stock Items</CardTitle>
            <CardDescription>Products that need restocking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockProducts.length > 0 ? (
                lowStockProducts.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        SKU: {item.sku}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{item.quantity} left</p>
                      <div className="w-20">
                        <Progress
                          value={(item.quantity / (item.minStock * 2)) * 100}
                          className="h-2"
                        />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center p-8 text-muted-foreground">
                  <div className="text-center">
                    <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    <p>All items are well stocked!</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;