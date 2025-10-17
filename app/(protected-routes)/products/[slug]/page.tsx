"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import {
  ProductForm,
  ProductFormValues,
} from "@/components/products/product-form";
import { usePostData } from "@/hooks/mutations/use-post-data";
import { api } from "@/api/endpoints/api";
import { showToastNotification } from "@/components/toast/show-toast-notification";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import useFetchQuery from "@/hooks/queries/use-fetch-query";
import { IProduct } from "@/types";

interface EditProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const router = useRouter();
  const { slug } = use(params);

  // Fetch product data
  const { data: product, isLoading } = useFetchQuery<IProduct>({
    url: `${api.products}/${slug}`,
  });

  const { mutate, isPending } = usePostData({
    invalidateQueries: [api.products],
    onSuccess: () => {
      showToastNotification({
        message: "Product updated successfully",
        variant: "success",
      });
      router.push("/products");
    },
    doNotShowToast: true,
  });

  const handleSubmit = (values: ProductFormValues) => {
    mutate({
      url: `${api.products}/${product?.id}`,
      postData: values,
      method: "PUT",
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Product not found</h2>
          <Button
            variant="outline"
            onClick={() => router.push("/products")}
            className="mt-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

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
        <h1 className="text-3xl font-bold">Edit Product</h1>
        <p className="text-muted-foreground mt-2">
          Update product information for {product.name}
        </p>
      </div>

      <ProductForm
        defaultValues={product}
        onSubmit={handleSubmit}
        isSubmitting={isPending}
        submitLabel="Update Product"
      />
    </div>
  );
}
