"use client";

import { useRouter } from "next/navigation";
import { ProductForm, ProductFormValues } from "@/components/products/product-form";
import { usePostData } from "@/hooks/mutations/use-post-data";
import { api } from "@/api/endpoints/api";
import { showToastNotification } from "@/components/toast/show-toast-notification";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NewProductPage() {
  const router = useRouter();

  const { mutate, isPending } = usePostData({
    invalidateQueries: [api.products],
    onSuccess: () => {
      showToastNotification({
        message: "Product created successfully",
        variant: "success",
      });
      router.push("/products");
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
    <div className="container mx-auto p-6 max-w-2xl">
      <Button
        variant="ghost"
        onClick={() => router.push("/products")}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Products
      </Button>

      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create New Product</h1>
        <p className="text-muted-foreground mt-2">
          Add a new product to your inventory
        </p>
      </div>

      <ProductForm
        onSubmit={handleSubmit}
        isSubmitting={isPending}
        submitLabel="Create Product"
      />
    </div>
  );
}
