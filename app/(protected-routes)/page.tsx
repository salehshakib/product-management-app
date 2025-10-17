"use client";

import { api } from "@/api/endpoints/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useFetchQuery from "@/hooks/queries/use-fetch-query";
import { ICategory, IProduct } from "@/types";
import { FolderOpen, Package, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import Link from "next/link";

const StatCard = ({
  title,
  value,
  description,
  icon: Icon,
  isLoading,
  bgColor,
  iconColor,
}: {
  title: string;
  value: number;
  description: string;
  icon: React.ElementType;
  isLoading: boolean;
  bgColor: string;
  iconColor: string;
}) => (
  <motion.div
    whileHover={{ y: -4 }}
    transition={{ type: "spring", stiffness: 400, damping: 10 }}
  >
    <Card className="border-none bg-card hover:shadow-md transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-semibold text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-lg ${bgColor}`}>
          <Icon className={`h-4 w-4 ${iconColor}`} />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-7 w-16 rounded" />
        ) : (
          <div className="text-2xl md:text-3xl font-bold text-foreground">
            {value}
          </div>
        )}
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  </motion.div>
);

const QuickActionCard = ({
  title,
  description,
  href,
  icon: Icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
}) => (
  <Link href={href} className="block">
    <motion.div whileTap={{ scale: 0.98 }}>
      <Card className="border-none bg-card hover:bg-accent/30 transition-all duration-300 h-full">
        <CardContent className="pt-5 pb-4 px-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="p-2.5 bg-primary/10 rounded-lg mt-0.5">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {description}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center w-8 h-8 rounded-full border border-dashed border-primary/30 text-primary">
              <Plus className="h-4 w-4" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  </Link>
);

export default function Home() {
  const { data: products, isLoading: isProductsLoading } = useFetchQuery<
    IProduct[]
  >({
    url: api.products,
  });

  const { data: categories, isLoading: isCategoriesLoading } = useFetchQuery<
    ICategory[]
  >({
    url: api.categories,
  });

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your inventory and product categories efficiently
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="grid gap-6 sm:grid-cols-2"
      >
        <StatCard
          title="Total Products"
          value={products?.length || 0}
          description="Active products in inventory"
          icon={Package}
          isLoading={isProductsLoading}
          bgColor="bg-blue-50 dark:bg-blue-900/20"
          iconColor="text-blue-600 dark:text-blue-400"
        />
        <StatCard
          title="Total Categories"
          value={categories?.length || 0}
          description="Product categories available"
          icon={FolderOpen}
          isLoading={isCategoriesLoading}
          bgColor="bg-emerald-50 dark:bg-emerald-900/20"
          iconColor="text-emerald-600 dark:text-emerald-400"
        />
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Quick Actions
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <QuickActionCard
            title="Add New Product"
            description="Create a new product listing"
            href="/products/new"
            icon={Package}
          />
        </div>
      </motion.div>
    </div>
  );
}
