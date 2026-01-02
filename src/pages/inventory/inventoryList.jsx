import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Package,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  setSearchQuery,
  setCategoryFilter,
  setStatusFilter,
  setCurrentPage,
} from "@/store/slices/inventorySlice";
import { useSelector, useDispatch } from "react-redux";
import InventoryForm from "@/pages/inventory/InventoryForm";
import { Pagination } from "@/pages/paggination";
// import BulkActionDialog from "@/pages/inventory/BulkActionDialog"; // Not implemented, commented out

const ITEMS_PER_PAGE = 10;
const API_BASE = "http://localhost:5000";

// --- Utility Functions ---
const getStatusIcon = (status) => {
  switch (status) {
    case "in-stock":
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case "low-stock":
      return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    case "out-of-stock":
      return <XCircle className="w-4 h-4 text-red-500" />;
    default:
      return null;
  }
};

const getStatusBadge = (status) => {
  switch (status) {
    case "in-stock":
      return (
        <Badge className="bg-green-600 hover:bg-green-700 text-white dark:bg-green-800 dark:text-green-500">
          In Stock
        </Badge>
      );
    case "low-stock":
      return (
        <Badge className="bg-yellow-600 hover:bg-yellow-700 text-white dark:bg-yellow-800 dark:text-yellow-500">
          Low Stock
        </Badge>
      );
    case "out-of-stock":
      return (
        <Badge className="bg-red-600 hover:bg-red-700 text-white dark:bg-red-800 dark:text-red-500">
          Out of Stock
        </Badge>
      );
    default:
      return <Badge variant="secondary">Unknown</Badge>;
  }
};
// --- Utility Functions End ---

function InventoryList() {
  const dispatch = useDispatch();
  const { currentPage, searchQuery, categoryFilter, statusFilter } =
    useSelector((state) => state.inventory);

  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  // const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false); // Not implemented, commented out
  // const [bulkActionType, setBulkActionType] = useState("delete"); // Not implemented, commented out

  // Fetch inventory from backend with pagination & filters
  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/api/inventory`, {
        params: {
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          search: searchQuery,
          category: categoryFilter,
          status: statusFilter,
        },
      });
      setItems(response.data.items || []);
      setTotalPages(response.data.pages || 1);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
      toast.error("Failed to load inventory items");
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [currentPage, searchQuery, categoryFilter, statusFilter]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      await axios.delete(`${API_BASE}/api/inventory/${id}`);
      toast.success("Item deleted successfully!");
      fetchInventory();
    } catch (err) {
      toast.error("Failed to delete item");
    }
  };

  const handleEdit = (item) => {
    // THIS is the key to loading previous data
    setEditingItem(item);
    setIsEditDialogOpen(true);
  };

  // PDF Export
  const exportToPDF = () => {
    if (!items.length) return toast.error("No products to export!");

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Inventory Report", 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    doc.text(`Total Products: ${items.length}`, 14, 36);

    const tableColumn = [
      "Name",
      "SKU",
      "Category",
      "Price (LKR)",
      "Quantity",
      "Status",
      "Supplier",
    ];
    const tableRows = items.map((item) => [
      item.name || "-",
      item.sku || "-",
      item.category || "-",
      item.price != null ? item.price.toFixed(2) : "0.00",
      item.quantity != null ? item.quantity : 0,
      item.status || "-",
      item.supplier || "-",
    ]);

    autoTable(doc, {
      startY: 45,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      styles: { fontSize: 10 },
      tableWidth: "auto",
    });

    doc.save(`inventory-report-${new Date().toISOString().split("T")[0]}.pdf`);
  };

  // Get unique categories for filter
  const categories = Array.from(new Set(items.map((item) => item.category)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inventory</h1>
          <p className="text-muted-foreground">Manage your product inventory</p>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={exportToPDF}>
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>

          {/* Add Product Dialog */}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" /> Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>
                  Add a new product to your inventory
                </DialogDescription>
              </DialogHeader>
              <InventoryForm
                isEdit={false}
                onClose={() => {
                  setIsAddDialogOpen(false);
                  fetchInventory();
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filters & Search</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => {
                  dispatch(setSearchQuery(e.target.value));
                  dispatch(setCurrentPage(1));
                }}
                className="pl-10 w-full"
              />
            </div>

            <Select
              value={categoryFilter || "all"}
              onValueChange={(value) => {
                dispatch(setCategoryFilter(value === "all" ? "" : value));
                dispatch(setCurrentPage(1));
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={statusFilter || "all"}
              onValueChange={(value) => {
                dispatch(setStatusFilter(value === "all" ? "" : value));
                dispatch(setCurrentPage(1));
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="in-stock">In Stock</SelectItem>
                <SelectItem value="low-stock">Low Stock</SelectItem>
                <SelectItem value="out-of-stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                dispatch(setSearchQuery(""));
                dispatch(setCategoryFilter(""));
                dispatch(setStatusFilter(""));
                dispatch(setCurrentPage(1));
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Package className="w-5 h-5" />
            <span>Products ({items.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-12">Loading...</p>
          ) : items.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                        Image
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                        Product
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                        SKU
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                        Category
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                        Price
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                        Quantity
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                        Supplier
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                    {items.map((item) => (
                      <tr
                        key={item._id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150"
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                            {item.image ? (
                              <img
                                src={`${API_BASE}${item.image}`}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Package className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {item.name}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {item.sku}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {item.category}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          LKR {item.price.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(item.status)}
                            <span>{item.quantity}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {getStatusBadge(item.status)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {item.supplier}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(item)}
                              className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(item._id)}
                              className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="mt-4">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => dispatch(setCurrentPage(page))}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-gray-500">
                {searchQuery || categoryFilter || statusFilter
                  ? "Try adjusting your filters"
                  : "Get started by adding your first product"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog - Uses editingItem for initialData */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update product details</DialogDescription>
          </DialogHeader>
          {editingItem && (
            <InventoryForm
              isEdit={true}
              initialData={editingItem}
              onClose={() => {
                setIsEditDialogOpen(false);
                fetchInventory();
                setEditingItem(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default InventoryList;
