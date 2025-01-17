'use client'

import { useState, useEffect } from 'react';
import { wixClientServer } from "@/lib/wixClientServer";
import { products } from "@wix/stores";
import Image from "next/image";
import Link from "next/link"
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { MapPin, Menu, Search, ShoppingCart, User, Filter, ChevronDown } from 'lucide-react';
import Pagination from '../Pagination';
import { motion } from 'framer-motion';

const PRODUCT_PER_PAGE = 8;

const NewProductsList = ({ categoryId, limit, searchParams }: {
  categoryId: string;
  limit?: number;
  searchParams?: any;
}) => {
  const [products, setProducts] = useState<products.Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      const wixClient = await wixClientServer();
      const productQuery = wixClient.products
        .queryProducts()
        .startsWith("name", searchParams?.name || "")
        .eq("collectionIds", categoryId)
        .hasSome(
          "productType",
          searchParams?.type ? [searchParams.type] : ["physical", "digital"]
        )
        .gt("priceData.price", searchParams?.min || 0)
        .lt("priceData.price", searchParams?.max || 999999)
        .limit(limit || PRODUCT_PER_PAGE)
        .skip(
          searchParams?.page
            ? parseInt(searchParams.page) * (limit || PRODUCT_PER_PAGE)
            : 0
        );

      if (searchParams?.sort) {
        const [sortType, sortBy] = searchParams.sort.split(" ");
        if (sortType === "asc") {
          productQuery.ascending(sortBy);
        }
        if (sortType === "desc") {
          productQuery.descending(sortBy);
        }
      }

      const res = await productQuery.find();
      setProducts(res.items);
      setIsLoading(false);
    };

    fetchProducts();
  }, [categoryId, limit, searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/20 to-background">
      <header className="bg-primary text-primary-foreground py-4 sticky top-0 z-50 shadow-md">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">ShopNow</Link>
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="hover:text-secondary transition-colors">Home</Link>
            <Link href="/categories" className="hover:text-secondary transition-colors">Categories</Link>
            <Link href="/deals" className="hover:text-secondary transition-colors">Deals</Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Amazing Products</h1>
          <p className="text-xl text-muted-foreground mb-8">Find the perfect item for you</p>
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative max-w-md w-full">
              <Input 
                placeholder="Search products..." 
                className="pl-10"
              />
              <Search className="h-5 w-5 text-muted-foreground absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Price: Low to High</DropdownMenuItem>
                <DropdownMenuItem>Price: High to Low</DropdownMenuItem>
                <DropdownMenuItem>Newest First</DropdownMenuItem>
                <DropdownMenuItem>Popular</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </section>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {products.map((product) => (
              <motion.div
                key={product._id}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="overflow-hidden h-full flex flex-col">
                  <Link href={"/" + product.slug} className="flex-grow">
                    <div className="relative aspect-square bg-secondary/30 group">
                      <Image
                        src={product.media?.mainMedia?.image?.url || "/product.png"}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className="object-cover transition-opacity duration-300 ease-in-out group-hover:opacity-75"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300 flex items-center justify-center">
                        <Button variant="secondary" className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          View Details
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-4 bg-primary/5 flex-grow">
                      <h3 className="text-lg font-semibold line-clamp-1 text-primary">{product.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {product.additionalInfoSections?.find((section: any) => section.title === "shortDesc")?.description || ""}
                      </p>
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-primary font-bold text-lg">R{product.price?.price}</span>
                        <Button variant="secondary" size="sm" className="bg-primary/10 hover:bg-primary hover:text-primary-foreground transition-colors duration-300">
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to Cart
                        </Button>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {searchParams?.cat || searchParams?.name ? (
          <Pagination
            currentPage={searchParams?.page || 0}
            hasPrev={!!searchParams?.page && searchParams.page > 0}
            hasNext={products.length === PRODUCT_PER_PAGE}
          />
        ) : null}
      </main>

      <footer className="bg-primary text-primary-foreground py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">About Us</h3>
              <p className="text-sm">We're passionate about bringing you the best products at great prices.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/faq" className="text-sm hover:underline">FAQ</Link></li>
                <li><Link href="/shipping" className="text-sm hover:underline">Shipping</Link></li>
                <li><Link href="/returns" className="text-sm hover:underline">Returns</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
              <p className="text-sm">Email: support@shopnow.com</p>
              <p className="text-sm">Phone: (123) 456-7890</p>
            </div>
          </div>
          <div className="mt-8 text-center text-sm">
            © 2023 ShopNow. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NewProductsList;

