"use client";

import { api } from "@/api/endpoints/api";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useFetchQuery from "@/hooks/queries/use-fetch-query";
import { ICategory } from "@/types";
import { ChevronDown, Filter } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface CategoryFilterProps {}

export function CategoryFilter({}: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const limit = parseInt(searchParams.get("limit") || "10");

  const { data: categories, isLoading } = useFetchQuery<ICategory[]>({
    url: api.categories,
  });

  const categoryId = searchParams.get("categoryId") || null;

  const selectedCategory = categories?.find((cat) => cat.id === categoryId);

  const handleCategoryChange = (newCategoryId: string | null) => {
    const params = new URLSearchParams();

    if (newCategoryId) {
      params.set("categoryId", newCategoryId);
    }

    // Reset to first page when category changes
    params.set("offset", "0");
    params.set("limit", limit.toString());

    const newUrl = `/products?${params.toString()}`;
    router.push(newUrl);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          {selectedCategory ? selectedCategory.name : "All Categories"}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuItem onClick={() => handleCategoryChange(null)}>
          All Categories
        </DropdownMenuItem>
        {isLoading ? (
          <DropdownMenuItem disabled>Loading...</DropdownMenuItem>
        ) : categories && categories?.length > 0 ? (
          categories?.map((category) => {
            console.log(category);

            return (
              <DropdownMenuItem
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
              >
                {category.name}
              </DropdownMenuItem>
            );
          })
        ) : (
          <DropdownMenuItem disabled>No categories available</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
