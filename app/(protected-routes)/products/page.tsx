"use client";

import { api } from "@/api/endpoints/api";
import { CategoryFilter } from "@/components/common/category-filter";
import { ColumnDef, DataTable } from "@/components/common/data-table";
import { SearchBar } from "@/components/common/search-bar";
import { ProductActionCells } from "@/components/products/product-action-cells";
import { Button } from "@/components/ui/button";
import useFetchQuery from "@/hooks/queries/use-fetch-query";
import { useCustomDebounce } from "@/hooks/use-debounce";
import { IProduct } from "@/types";
import { Plus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface ProductsPageProps {}

const createColumns = (): ColumnDef<IProduct>[] => [
  {
    key: "images",
    header: "Image",
    render: (item) => (
      <div className="w-12 h-12 relative">
        {item.images?.[0] ? (
          // <Image
          //   src={item.images?.[0]}
          //   alt={item.name}
          //   fill
          //   className="object-cover rounded"
          // />
          <img
            src={item?.images?.[0]}
            alt={item.name}
            className="size-12 rounded-full"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400">
            No Image
          </div>
        )}
      </div>
    ),
  },
  {
    key: "name",
    header: "Name",
    cell: (value) => (
      <div className="max-w-xs truncate" title={value}>
        {value}
      </div>
    ),
  },
  {
    key: "description",
    header: "Description",
    cell: (value) => (
      <div className="max-w-xs truncate" title={value}>
        {value}
      </div>
    ),
  },
  {
    key: "price",
    header: "Price",
    cell: (value) => `$${value.toFixed(2)}`,
  },
  {
    key: "category",
    header: "Category",
    render: (item) => item.category?.name || "N/A",
  },
  {
    key: "actions",
    header: "",
    render: (item) => <ProductActionCells product={item} />,
  },
];

export default function ProductsPage({}: ProductsPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get query params from URL
  const offset = parseInt(searchParams.get("offset") || "0");
  const limit = parseInt(searchParams.get("limit") || "10");
  const searchQuery = searchParams.get("search") || "";
  const categoryId = searchParams.get("categoryId") || null;

  // Setup debounced search
  const { keyword, value, setValue } = useCustomDebounce(searchQuery, 600);

  // Fetch products with search and pagination params
  const { data, isLoading } = useFetchQuery<IProduct[]>({
    url: api.products,
    params: {
      offset,
      limit,
      ...(searchQuery && { searchedText: searchQuery }),
      ...(categoryId && { categoryId }),
    },
  });

  const handlePaginationChange = (newOffset: number, newLimit: number) => {
    const params = new URLSearchParams();

    if (searchQuery) {
      params.set("search", searchQuery);
    }

    if (categoryId) {
      params.set("categoryId", categoryId);
    }

    params.set("offset", newOffset.toString());
    params.set("limit", newLimit.toString());

    const newUrl = `/products?${params.toString()}`;
    router.push(newUrl);
  };

  const products = Array.isArray(data) ? data : [];
  const total = data?.length || 0;

  const columns = createColumns();

  return (
    <div className="container mx-auto py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button onClick={() => router.push("/products/new")}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <SearchBar
          placeholder="Search products..."
          value={value}
          onChange={setValue}
        />
        <CategoryFilter />
      </div>

      <DataTable
        columns={columns}
        data={products}
        isLoading={isLoading}
        pagination={{
          total: data?.length || 0,
          offset,
          limit,
        }}
        onPaginationChange={handlePaginationChange}
        emptyMessage="No products found"
      />
    </div>
  );
}
