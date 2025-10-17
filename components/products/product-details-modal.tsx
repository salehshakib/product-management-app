"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IProduct } from "@/types";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Pencil, Trash2 } from "lucide-react";

interface ProductDetailsModalProps {
  product: IProduct | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete?: () => void;
}

export function ProductDetailsModal({
  product,
  open,
  onOpenChange,
  onDelete,
}: ProductDetailsModalProps) {
  const router = useRouter();

  if (!product) return null;

  const handleEdit = () => {
    onOpenChange(false);
    router.push(`/products/${product.slug}`);
  };

  const handleDelete = () => {
    onOpenChange(false);
    onDelete?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:w-[90vw] md:max-w-2xl lg:max-w-4xl xl:max-w-6xl max-h-[90vh] sm:max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Product Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-100px)] sm:max-h-[calc(85vh-100px)]">
          <div className="space-y-4 sm:space-y-6 p-1">
            {product.images && product.images.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Images</h3>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                  {product.images.map((image, index) => (
                    <div
                      key={index}
                      className="relative w-full aspect-square rounded-lg overflow-hidden border"
                    >
                      <img
                        src={image}
                        alt={`${product.name} - ${index + 1}`}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3 sm:space-y-4">
              <div>
                <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Name
                </h3>
                <p className="text-sm sm:text-base">{product.name}</p>
              </div>

              <div>
                <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Description
                </h3>
                <p className="text-sm sm:text-base">{product.description}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Price
                  </h3>
                  <p className="text-sm sm:text-base font-semibold">
                    ${product.price.toFixed(2)}
                  </p>
                </div>

                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Category
                  </h3>
                  <p className="text-sm sm:text-base">{product.category?.name || "N/A"}</p>
                </div>
              </div>

              <div>
                <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Slug
                </h3>
                <p className="font-mono text-xs sm:text-sm">{product.slug}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4">
                <Button onClick={handleEdit} className="w-full sm:w-auto sm:ml-auto" variant="default">
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>
                <Button
                  onClick={handleDelete}
                  className="w-full sm:w-auto"
                  variant="destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
