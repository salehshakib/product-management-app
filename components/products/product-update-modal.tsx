"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IProduct } from "@/types";
import { ProductForm, ProductFormValues } from "./product-form";
import { usePostData } from "@/hooks/mutations/use-post-data";
import { api } from "@/api/endpoints/api";
import { showToastNotification } from "@/components/toast/show-toast-notification";

interface ProductUpdateModalProps {
  product: IProduct;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductUpdateModal({
  product,
  open,
  onOpenChange,
}: ProductUpdateModalProps) {
  const { mutate, isPending } = usePostData({
    invalidateQueries: [api.products],
    onSuccess: () => {
      showToastNotification({
        message: "Product updated successfully",
        variant: "success",
      });
      onOpenChange(false);
    },
    doNotShowToast: true,
  });

  const handleSubmit = (values: ProductFormValues) => {
    mutate({
      url: `${api.products}/${product.id}`,
      postData: values,
      method: "PUT",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <ProductForm
            defaultValues={product}
            onSubmit={handleSubmit}
            isSubmitting={isPending}
            submitLabel="Update Product"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
