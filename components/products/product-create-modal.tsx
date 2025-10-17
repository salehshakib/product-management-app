"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProductForm, ProductFormValues } from "./product-form";
import { usePostData } from "@/hooks/mutations/use-post-data";
import { api } from "@/api/endpoints/api";
import { showToastNotification } from "@/components/toast/show-toast-notification";

interface ProductCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductCreateModal({
  open,
  onOpenChange,
}: ProductCreateModalProps) {
  const { mutate, isPending } = usePostData({
    invalidateQueries: [api.products],
    onSuccess: () => {
      showToastNotification({
        message: "Product created successfully",
        variant: "success",
      });
      onOpenChange(false);
    },
    doNotShowToast: true,
  });

  const handleSubmit = (values: ProductFormValues) => {
    mutate({
      url: api.products,
      postData: values,
      method: "POST",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Product</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <ProductForm
            onSubmit={handleSubmit}
            isSubmitting={isPending}
            submitLabel="Create Product"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
