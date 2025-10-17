"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, Pencil, Trash2, MoreVertical } from "lucide-react";
import { IProduct } from "@/types";
import { ProductDetailsModal } from "./product-details-modal";
import { ProductDeleteModal } from "./product-delete-modal";

interface ProductActionCellsProps {
  product: IProduct;
}

export function ProductActionCells({ product }: ProductActionCellsProps) {
  const router = useRouter();
  const [isDetailsModalOpen, setIsDetailsModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);

  return (
    <>
      <div className="flex items-center justify-end gap-2">
        <Button
          onClick={() => setIsDetailsModalOpen(true)}
          title="View Details"
        >
          <Eye className="h-4 w-4" />
          View
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              onClick={() => router.push(`/products/${product.slug}`)}
              className="cursor-pointer focus:bg-accent focus:text-accent-foreground"
            >
              <Pencil className="h-4 w-4 text-primary" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setIsDeleteModalOpen(true)}
              className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
            >
              <Trash2 className="h-4 w-4 text-destructive/80" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ProductDetailsModal
        product={product}
        open={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
        onDelete={() => setIsDeleteModalOpen(true)}
      />

      <ProductDeleteModal
        product={product}
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
      />
    </>
  );
}
