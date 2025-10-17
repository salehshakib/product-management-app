"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IProduct } from "@/types";
import { usePostData } from "@/hooks/mutations/use-post-data";
import { api } from "@/api/endpoints/api";
import { showToastNotification } from "@/components/toast/show-toast-notification";

interface ProductDeleteModalProps {
  product: IProduct | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductDeleteModal({
  product,
  open,
  onOpenChange,
}: ProductDeleteModalProps) {
  const { mutate, isPending } = usePostData({
    invalidateQueries: [api.products],
    onSuccess: () => {
      showToastNotification({
        message: "Product deleted successfully",
        variant: "success",
      });
      onOpenChange(false);
    },
    doNotShowToast: true,
  });

  const handleDelete = () => {
    if (!product) return;

    mutate({
      url: `${api.products}/${product.id}`,
      method: "DELETE",
    });
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Product</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{product.name}"? This action cannot
            be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
