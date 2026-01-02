import React, { useState, useEffect } from "react";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  useCreateInventoryItemMutation,
  useUpdateInventoryItemMutation,
} from "@/state/inventoryApi";

function InventoryForm({ item, onClose }) {
  const [createItem] = useCreateInventoryItemMutation();
  const [updateItem] = useUpdateInventoryItemMutation();

  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(item?.image || null);

  const [formData, setFormData] = useState({
    name: item?.name || "",
    description: item?.description || "",
    sku: item?.sku || "",
    category: item?.category || "",
    price: item?.price?.toString() || "",
    quantity: item?.quantity?.toString() || "",
    minStock: item?.minStock?.toString() || "",
    supplier: item?.supplier || "",
    status: item?.status || "in-stock",
  });

  const categories = ["Electronics", "Accessories", "Cables", "Tools", "Other"];

  // Auto-generate SKU for new items
  useEffect(() => {
    if (!item && !formData.sku && formData.name) {
      const sku =
        formData.name
          .toUpperCase()
          .replace(/[^A-Z0-9]/g, "")
          .substring(0, 3) +
        "-" +
        Date.now().toString().slice(-3);
      setFormData((prev) => ({ ...prev, sku }));
    }
  }, [formData.name, item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => setImagePreview(null);

  const validateForm = () => {
    if (!formData.name.trim())
      return toast.error("Product name is required"), false;
    if (!formData.sku.trim()) return toast.error("SKU is required"), false;
    if (!formData.category) return toast.error("Category is required"), false;
    if (!formData.price || parseFloat(formData.price) <= 0)
      return toast.error("Valid price is required"), false;
    if (!formData.quantity || parseInt(formData.quantity) < 0)
      return toast.error("Valid quantity is required"), false;
    if (!formData.minStock || parseInt(formData.minStock) < 0)
      return toast.error("Valid minimum stock is required"), false;
    return true;
  };

  const determineStatus = (quantity, minStock) => {
    if (quantity === 0) return "out-of-stock";
    if (quantity <= minStock) return "low-stock";
    return "in-stock";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const quantity = parseInt(formData.quantity);
      const minStock = parseInt(formData.minStock);
      const status = determineStatus(quantity, minStock);

      const itemData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        sku: formData.sku.trim().toUpperCase(),
        category: formData.category,
        price: parseFloat(formData.price),
        quantity,
        minStock,
        supplier: formData.supplier.trim(),
        status,
        image: imagePreview || undefined,
      };

      if (item) {
        await updateItem({ id: item.id, formData: itemData }).unwrap();
        toast.success("Product updated successfully!");
      } else {
        await createItem(itemData).unwrap();
        toast.success("Product added successfully!");
      }

      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* LEFT */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              required
            />
          </div>

          <div>
            <Label htmlFor="sku">SKU *</Label>
            <Input
              id="sku"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              placeholder="Product SKU"
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(val) => handleSelectChange("category", val)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="supplier">Supplier</Label>
            <Input
              id="supplier"
              name="supplier"
              value={formData.supplier}
              onChange={handleChange}
              placeholder="Supplier name"
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="price">Price (LKR) *</Label>
            <Input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <Label htmlFor="quantity">Quantity *</Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              min="0"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="0"
              required
            />
          </div>

          <div>
            <Label htmlFor="minStock">Minimum Stock *</Label>
            <Input
              id="minStock"
              name="minStock"
              type="number"
              min="0"
              value={formData.minStock}
              onChange={handleChange}
              placeholder="0"
              required
            />
          </div>

          <div>
            <Label>Product Image</Label>
            <Card className="mt-2">
              <CardContent className="p-4">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Product preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={removeImage}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Upload image</span>
                    <span className="text-xs text-gray-400">Max 5MB</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* DESCRIPTION */}
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Product description..."
          rows={3}
        />
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : item ? "Update Product" : "Add Product"}
        </Button>
      </div>
    </form>
  );
}

export default InventoryForm;
