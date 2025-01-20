"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ShoppingCart } from "lucide-react";
import Pagination from "../Pagination";
import { wixClientServer } from "@/lib/wixClientServer";
import { products } from "@wix/stores";

const PRODUCTS_PER_PAGE = 8;

interface SearchParams {
  name?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  sort?: string;
}

const NewProductList = async ({ categoryId }: { categoryId: string }) => {
  const wixClient = await wixClientServer();
  const [searchParams, setSearchParams] = useState<SearchParams>({
    name: "",
    category: "",
    minPrice: 0,
    maxPrice: 999999,
    page: 0,
    sort: "relevance",
  });

  const handleSearch = (field: keyof SearchParams, value: string | number) => {
    setSearchParams((prev) => ({ ...prev, [field]: value }));
  };

  const productQuery = wixClient.products
    .queryProducts()
    .startsWith("name", searchParams.name || "")
    .eq("collectionIds", categoryId)
    .hasSome("productType", ["physical", "digital"])
    .gt("priceData.price", searchParams.minPrice)
    .lt("priceData.price", searchParams.maxPrice)
    .limit(PRODUCTS_PER_PAGE)
    .skip((searchParams.page || 0) * PRODUCTS_PER_PAGE);

  if (searchParams.sort === "price-asc") productQuery.ascending("priceData.price");
  if (searchParams.sort === "price-desc") productQuery.descending("priceData.price");
  if (searchParams.sort === "name-asc") productQuery.ascending("name");
  if (searchParams.sort === "name-desc") productQuery.descending("name");

  const res = await productQuery.find();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-50">
      <main className="container mx-auto px-6 py-8">
        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <Input
            placeholder="Search products..."
            value={searchParams.name}
            onChange={(e) => handleSearch("name", e.target.value)}
            className="flex-grow"
          />
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="outline">Sort</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleSearch("sort", "relevance")}>
                Relevance
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSearch("sort", "price-asc")}>
                Price: Low to High
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSearch("sort", "price-desc")}>
                Price: High to Low
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSearch("sort", "name-asc")}>
                Name: A-Z
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSearch("sort", "name-desc")}>
                Name: Z-A
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex items-center gap-4">
            <Input
              type="number"
              placeholder="Min Price"
              onChange={(e) => handleSearch("minPrice", Number(e.target.value))}
            />
            <Input
              type="number"
              placeholder="Max Price"
              onChange={(e) => handleSearch("maxPrice", Number(e.target.value))}
            />
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {res.items.map((product: products.Product) => (
            <Card
              key={product._id}
              className="overflow-hidden transition-shadow hover:shadow-lg rounded-lg"
            >
              <Link href={`/${product.slug}`}>
                <div className="relative aspect-square bg-gray-100">
                  <Image
                    src={product.media?.mainMedia?.image?.url || "/placeholder.png"}
                    alt={product.name || "Product"}
                    fill
                    className="object-contain"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="text-lg font-medium text-gray-800">{product.name}</h3>
                  <p className="text-sm text-gray-600">
                    {product.additionalInfoSections?.find((section: any) => section.title === "shortDesc")?.description ||
                      ""}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xl font-semibold text-gray-900">
                      R{product.price?.price}
                    </span>
                    <Button variant="secondary" size="sm">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {/* <Pagination
          currentPage={searchParams.page || 0}
          hasPrev={res.hasPrev()}
          hasNext={res.hasNext()}
          onPageChange={(page) => handleSearch("page", page)}
        /> */}
      </main>
    </div>
  );
};

export default NewProductList;
