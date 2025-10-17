"use client";

import { api } from "@/api/endpoints/api";
import useFetchQuery from "@/hooks/queries/use-fetch-query";
import { ICategory } from "@/types";
import { DataTable, ColumnDef } from "@/components/common/data-table";
import { SearchBar } from "@/components/common/search-bar";
import { useCustomDebounce } from "@/hooks/use-debounce";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface CategoriesPageProps {}

const createColumns = (): ColumnDef<ICategory>[] => [
  {
    key: "image",
    header: "Image",
    render: (item) => (
      <div className="w-12 h-12 relative">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="size-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-400">
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
      <div
        className="max-w-xs truncate text-sm"
        title={value || "No description"}
      >
        {value || (
          <span className="text-muted-foreground italic">No description</span>
        )}
      </div>
    ),
  },
];

export default function CategoriesPage({}: CategoriesPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get query params from URL
  const offset = parseInt(searchParams.get("offset") || "0");
  const limit = parseInt(searchParams.get("limit") || "10");
  const searchQuery = searchParams.get("search") || "";

  // Setup debounced search
  const { keyword, value, setValue } = useCustomDebounce(searchQuery, 600);

  // Fetch categories with search and pagination params
  const { data, isLoading } = useFetchQuery<ICategory[]>({
    url: api.categories,
    params: {
      offset,
      limit,
      ...(searchQuery && { searchedText: searchQuery }),
    },
  });

  const handlePaginationChange = (newOffset: number, newLimit: number) => {
    const params = new URLSearchParams();

    if (searchQuery) {
      params.set("search", searchQuery);
    }

    params.set("offset", newOffset.toString());
    params.set("limit", newLimit.toString());

    const newUrl = `/categories?${params.toString()}`;
    router.push(newUrl);
  };

  const categories = Array.isArray(data) ? data : [];
  const columns = createColumns();

  return (
    <div className="container mx-auto py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Button onClick={() => {}}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <SearchBar
          placeholder="Search categories..."
          value={value}
          onChange={setValue}
        />
      </div>

      <DataTable
        columns={columns}
        data={categories}
        isLoading={isLoading}
        pagination={{
          total: data?.length || 0,
          offset,
          limit,
        }}
        onPaginationChange={handlePaginationChange}
        emptyMessage="No categories found"
      />
    </div>
  );
}
