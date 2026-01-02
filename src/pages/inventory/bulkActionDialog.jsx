import React, { useState } from 'react'
import { AlertTriangle, Currency, Package2, Trash } from 'lucide-react'
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";


function BulkActionDialog({ isOpen, onClose, actionType, onConfirm }) {

    const [pricePercentage, setPricePercentage] = useState("")
    const [priceType, setPriceType] = useState("increase")
    const [stockQuantity, setStockQuantity] = useState("")
    const [stockType, setStockType] = useState("add")

     const handleConfirm = () => {
    if (actionType === 'delete') {
      // For delete action → just call onConfirm with no data
      onConfirm()
    } else if (actionType === 'price') {
      // For price update → convert input to number
      const percentage = parseFloat(pricePercentage)
      if (percentage > 0) {
        // Send both percentage value and type (increase/decrease)
        onConfirm({ percentage, type: priceType })
      }
    } else if (actionType === 'stock') {
      // For stock update → convert input to integer
      const quantity = parseInt(stockQuantity)
      if (quantity >= 0) {
        // Send both quantity value and type (add/subtract/set)
        onConfirm({ quantity, type: stockType })
      }
    }
  };

  // Dynamically changes the dialog title based on the action type
  const getTitle = () => {
    switch (actionType) {
      case 'delete':
        return 'Delete All Products'
      case 'price':
        return 'Update All Prices'
      case 'stock':
        return 'Update All Stock'
      default:
        return 'Bulk Action'
    }
  };

  // Returns a relevant icon for the action type
  const getIcon = () => {
    switch (actionType) {
      case 'delete':
        return <Trash className="w-6 h-6 text-red-500" />
      case 'price':
        return <Currency className="w-6 h-6 text-green-500" />
      case 'stock':
        return <Package2 className="w-6 h-6 text-blue-500" />
      default:
        return null
    }
  };

  // Ensures user entered valid data
  const isValid = () => {
    if (actionType === 'delete') return true
    if (actionType === 'price') return pricePercentage && parseFloat(pricePercentage) > 0
    if (actionType === 'stock') return stockQuantity && parseInt(stockQuantity) >= 0
    return false
  }

  return (
    <div className="space-y-6">
        <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {getIcon()}
            <span>{getTitle()}</span>
          </DialogTitle>

          
          <DialogDescription>
            {actionType === 'delete' && 'This action will permanently delete all products from your inventory.'}
            {actionType === 'price' && 'Update the prices of all products by a percentage.'}
            {actionType === 'stock' && 'Update the stock quantities of all products.'}
          </DialogDescription>
        </DialogHeader>

       
        <div className="space-y-4">

      
          {actionType === 'delete' && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This action cannot be undone. All product data will be permanently lost.
              </AlertDescription>
            </Alert>
          )}

          {/* Price Update Action*/}
          {actionType === 'price' && (
            <div className="space-y-4">
              {/* Select price update type (increase/decrease) */}
              <div>
                <Label htmlFor="price-type">Price Update Type</Label>
                <Select value={priceType} onValueChange={(value) => setPriceType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="increase">Increase Prices</SelectItem>
                    <SelectItem value="decrease">Decrease Prices</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Input field for percentage */}
              <div>
                <Label htmlFor="price-percentage">Percentage (%)</Label>
                <Input
                  id="price-percentage"
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="e.g., 10"
                  value={pricePercentage}
                  onChange={(e) => setPricePercentage(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Stock Update Action*/}
          {actionType === 'stock' && (
            <div className="space-y-4">
              {/* Select stock update type (add/subtract/set) */}
              <div>
                <Label htmlFor="stock-type">Stock Update Type</Label>
                <Select value={stockType} onValueChange={(value) => setStockType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="add">Add to Current Stock</SelectItem>
                    <SelectItem value="subtract">Subtract from Current Stock</SelectItem>
                    <SelectItem value="set">Set Stock to Fixed Value</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Input field for stock quantity */}
              <div>
                <Label htmlFor="stock-quantity">Quantity</Label>
                <Input
                  id="stock-quantity"
                  type="number"
                  min="0"
                  placeholder="e.g., 50"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!isValid()}
            variant={actionType === 'delete' ? 'destructive' : 'default'}
          >
            {actionType === 'delete' ? 'Delete All' : 'Update All'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </div>
  );
}

export default BulkActionDialog;